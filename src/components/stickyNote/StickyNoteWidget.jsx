import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell,
  Trash2,
  Minus,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Highlighter,
  Check,
  Clock,
  X,
} from "lucide-react";
import {
  getStickyNote,
  updateStickyNote,
  deleteStickyNote,
  completeStickyNoteReminder,
  clearStickyNoteReminder,
} from "../../api/stickyNote";

// Color palettes matching the reference and prompt
export const NOTE_THEMES = [
  {
    id: "yellow",
    name: "Yellow",
    value: "#FEF08A",
    bg: "#FEF9C3",
    header: "#FDE047",
    toolbar: "#FEF9C3",
    border: "#FACC15",
    text: "#1F2937",
    indicator: "#FACC15",
  },
  {
    id: "light_yellow",
    name: "Light Yellow",
    value: "#FEF9C3",
    bg: "#FFFBEB",
    header: "#FEF08A",
    toolbar: "#FFFBEB",
    border: "#FEF08A",
    text: "#1F2937",
    indicator: "#FEF08A",
  },
  {
    id: "blue",
    name: "Blue",
    value: "#74b9ff",
    bg: "#E0F2FE",
    header: "#74b9ff",
    toolbar: "#E0F2FE",
    border: "#38BDF8",
    text: "#1F2937",
    indicator: "#74b9ff",
  },
  {
    id: "green",
    name: "Green",
    value: "#A7F3D0",
    bg: "#ECFDF5",
    header: "#6EE7B7",
    toolbar: "#ECFDF5",
    border: "#34D399",
    text: "#1F2937",
    indicator: "#34D399",
  },
  {
    id: "pink",
    name: "Pink",
    value: "#FBCFE8",
    bg: "#FDF2F8",
    header: "#F9A8D4",
    toolbar: "#FDF2F8",
    border: "#F472B6",
    text: "#1F2937",
    indicator: "#F472B6",
  },
  {
    id: "purple",
    name: "Purple",
    value: "#E9D5FF",
    bg: "#FAF5FF",
    header: "#D8B4FE",
    toolbar: "#FAF5FF",
    border: "#C084FC",
    text: "#1F2937",
    indicator: "#C084FC",
  },
];

const TEXT_COLORS = [
  { name: "Black", value: "#1F2937" },
  { name: "Gray", value: "#4B5563" },
  { name: "Red", value: "#DC2626" },
  { name: "Blue", value: "#2563EB" },
  { name: "Green", value: "#16A34A" },
  { name: "Purple", value: "#9333EA" },
];

const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "#FEF08A" },
  { name: "Green", value: "#BBF7D0" },
  { name: "Blue", value: "#BFDBFE" },
  { name: "Pink", value: "#FBCFE8" },
  { name: "None", value: "transparent" },
];

function findTheme(colorValue) {
  if (!colorValue) return NOTE_THEMES[0];
  const normalized = colorValue.toLowerCase().trim();
  const matched = NOTE_THEMES.find(
    (t) =>
      t.value.toLowerCase() === normalized ||
      t.id.toLowerCase() === normalized ||
      t.name.toLowerCase() === normalized
  );
  if (matched) return matched;

  // If a custom hex was stored, synthesize matching shades
  return {
    id: "custom",
    name: "Custom",
    value: colorValue,
    bg: colorValue,
    header: colorValue,
    toolbar: colorValue,
    border: "#CBD5E1",
    text: "#1F2937",
    indicator: colorValue,
  };
}

export default function StickyNoteWidget({
  isOpen,
  onClose,
  toggleButtonRef,
  onReminderStatusChange,
}) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const latestContentRef = useRef("");
  const savedRangeRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ pointerX: 0, pointerY: 0, noteX: 0, noteY: 0 });

  const [loading, setLoading] = useState(false);
  const [noteData, setNoteData] = useState(null);
  const [selectedColor, setSelectedColor] = useState(NOTE_THEMES[0].value);

  // Popover states
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [reminderMenuOpen, setReminderMenuOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [textStyleMenuOpen, setTextStyleMenuOpen] = useState(false);
  const [textColorMenuOpen, setTextColorMenuOpen] = useState(false);
  const [highlightMenuOpen, setHighlightMenuOpen] = useState(false);

  // Active formats state for toolbar buttons
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    bullet: false,
    ordered: false,
    block: "p",
  });

  // Reminder form state
  const [reminderDatetime, setReminderDatetime] = useState("");
  const [reminderSaving, setReminderSaving] = useState(false);

  // Dimensions state (approx 450x320 per specification)
  const [dimensions, setDimensions] = useState({ width: 450, height: 320 });
  const isResizingRef = useRef(false);
  const resizeStartRef = useRef({ x: 0, y: 0, w: 450, h: 320 });

  // Floating Position state (draggable anywhere within viewport)
  const [position, setPosition] = useState(() => {
    const initialWidth = 450;
    const defaultLeft =
      typeof window !== "undefined"
        ? Math.max(16, window.innerWidth - initialWidth - 24)
        : 800;
    const defaultTop = 88;
    return { x: defaultLeft, y: defaultTop };
  });

  const activeTheme = findTheme(selectedColor);

  // Save current editor selection range
  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  }, []);

  // Ensure editor is focused and has a valid selection range
  const ensureSelection = useCallback(() => {
    if (!editorRef.current) return false;
    editorRef.current.focus({ preventScroll: true });
    const sel = window.getSelection();
    if (!sel) return false;

    // If there is an existing saved range inside the editor, restore it
    if (
      savedRangeRef.current &&
      editorRef.current.contains(savedRangeRef.current.commonAncestorContainer)
    ) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
      return true;
    }

    // If active selection is already inside editor, save and use it
    if (sel.rangeCount > 0 && editorRef.current.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      return true;
    }

    // Otherwise create a range at the end of the editor
    const range = document.createRange();
    range.selectNodeContents(editorRef.current);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    savedRangeRef.current = range.cloneRange();
    return true;
  }, []);

  // Check active formatting in editor
  const updateActiveFormats = useCallback(() => {
    try {
      const isBold = document.queryCommandState("bold");
      const isItalic = document.queryCommandState("italic");
      const isUnderline = document.queryCommandState("underline");
      const isStrike = document.queryCommandState("strikeThrough");
      const isBullet = document.queryCommandState("insertUnorderedList");
      const isOrdered = document.queryCommandState("insertOrderedList");
      let blockVal = (document.queryCommandValue("formatBlock") || "").toLowerCase();
      if (blockVal.startsWith("<") && blockVal.endsWith(">")) {
        blockVal = blockVal.slice(1, -1);
      }

      setActiveFormats({
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        strike: isStrike,
        bullet: isBullet,
        ordered: isOrdered,
        block: blockVal || "p",
      });
    } catch (e) {
      // ignore
    }
  }, []);

  // Selection change listener on document
  useEffect(() => {
    const handleSelectionChange = () => {
      if (!isOpen) return;
      const sel = window.getSelection();
      if (
        sel &&
        sel.rangeCount > 0 &&
        editorRef.current &&
        editorRef.current.contains(sel.anchorNode)
      ) {
        saveSelection();
        updateActiveFormats();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [isOpen, saveSelection, updateActiveFormats]);

  // Load sticky note content from backend
  const loadNote = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStickyNote();
      setNoteData(data);
      if (data?.color) {
        setSelectedColor(data.color);
      }
      const initialHtml = data?.content || "";
      latestContentRef.current = initialHtml;
      if (editorRef.current) {
        editorRef.current.innerHTML = initialHtml;
      }
      if (data?.reminder_at) {
        try {
          const d = new Date(data.reminder_at);
          const offset = d.getTimezoneOffset() * 60000;
          const localISO = new Date(d.getTime() - offset).toISOString().slice(0, 16);
          setReminderDatetime(localISO);
        } catch {
          setReminderDatetime("");
        }
      } else {
        setReminderDatetime("");
      }
    } catch (err) {
      console.error("Failed to load sticky note:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when opened
  useEffect(() => {
    if (isOpen) {
      loadNote();
    } else {
      setColorMenuOpen(false);
      setReminderMenuOpen(false);
      setDeleteConfirmOpen(false);
      setTextStyleMenuOpen(false);
      setTextColorMenuOpen(false);
      setHighlightMenuOpen(false);
    }
  }, [isOpen, loadNote]);

  // Flush pending autosave immediately if closed or unmounted
  const flushAutosave = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
      try {
        await updateStickyNote({ content: latestContentRef.current });
      } catch (err) {
        console.error("Error flushing autosave:", err);
      }
    }
  }, []);

  // Debounced input handler (500–800ms)
  const handleEditorInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    latestContentRef.current = html;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateStickyNote({ content: html });
      } catch (err) {
        console.error("Autosave error:", err);
      }
    }, 600);
  };

  // Click outside handling
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        (!toggleButtonRef?.current || !toggleButtonRef.current.contains(e.target))
      ) {
        flushAutosave();
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose, toggleButtonRef, flushAutosave]);

  // Color change handler
  const handleColorChange = async (colorVal) => {
    setSelectedColor(colorVal);
    setColorMenuOpen(false);
    try {
      await updateStickyNote({ color: colorVal });
    } catch (err) {
      console.error("Failed to update sticky note color:", err);
    }
  };

  // Reminder save handler
  const handleSaveReminder = async () => {
    if (!reminderDatetime) return;
    setReminderSaving(true);
    try {
      const isoString = new Date(reminderDatetime).toISOString();
      await updateStickyNote({ reminder_at: isoString });
      setNoteData((prev) => ({ ...prev, reminder_at: isoString }));
      setReminderMenuOpen(false);
      if (onReminderStatusChange) onReminderStatusChange();
    } catch (err) {
      console.error("Failed to save reminder:", err);
    } finally {
      setReminderSaving(false);
    }
  };

  // Reminder complete handler
  const handleCompleteReminder = async () => {
    setReminderSaving(true);
    try {
      await completeStickyNoteReminder();
      setNoteData((prev) => ({ ...prev, reminder_at: null, is_completed: true }));
      setReminderDatetime("");
      setReminderMenuOpen(false);
      if (onReminderStatusChange) onReminderStatusChange();
    } catch (err) {
      console.error("Failed to complete reminder:", err);
    } finally {
      setReminderSaving(false);
    }
  };

  // Reminder clear handler
  const handleClearReminder = async () => {
    setReminderSaving(true);
    try {
      await clearStickyNoteReminder();
      setNoteData((prev) => ({ ...prev, reminder_at: null }));
      setReminderDatetime("");
      setReminderMenuOpen(false);
      if (onReminderStatusChange) onReminderStatusChange();
    } catch (err) {
      console.error("Failed to clear reminder:", err);
    } finally {
      setReminderSaving(false);
    }
  };

  // Quick preset reminders
  const handleSetQuickReminder = (type) => {
    const now = new Date();
    if (type === "1h") {
      now.setHours(now.getHours() + 1);
    } else if (type === "tomorrow9") {
      now.setDate(now.getDate() + 1);
      now.setHours(9, 0, 0, 0);
    } else if (type === "monday9") {
      const day = now.getDay();
      const diff = day === 0 ? 1 : 8 - day;
      now.setDate(now.getDate() + diff);
      now.setHours(9, 0, 0, 0);
    }
    const offset = now.getTimezoneOffset() * 60000;
    const local = new Date(now.getTime() - offset).toISOString().slice(0, 16);
    setReminderDatetime(local);
  };

  // Delete note handler
  const handleDeleteNote = async () => {
    try {
      await deleteStickyNote();
      setDeleteConfirmOpen(false);
      latestContentRef.current = "";
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      setNoteData(null);
      setSelectedColor(NOTE_THEMES[0].value);
      if (onReminderStatusChange) onReminderStatusChange();
      onClose();
    } catch (err) {
      console.error("Failed to delete sticky note:", err);
    }
  };

  // ── RICH TEXT FORMATTING COMMANDS ──────────────────────────────────
  const execFormat = (command, value = null) => {
    if (!editorRef.current) return;
    ensureSelection();
    document.execCommand("styleWithCSS", false, true);
    document.execCommand(command, false, value);
    saveSelection();
    updateActiveFormats();
    handleEditorInput();
  };

  // 1. Text block style (Paragraph, H1, H2, H3)
  const handleFormatBlock = (tag) => {
    if (!editorRef.current) return;
    ensureSelection();

    const currentHtml = editorRef.current.innerHTML.trim();
    if (!currentHtml || currentHtml === "<br>") {
      // Empty editor case: create the block element directly with a line break
      editorRef.current.innerHTML = `<${tag}><br></${tag}>`;
      const el = editorRef.current.querySelector(tag);
      if (el) {
        const range = document.createRange();
        range.setStart(el, 0);
        range.collapse(true);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        savedRangeRef.current = range.cloneRange();
      }
    } else {
      let success = false;
      try {
        success = document.execCommand("formatBlock", false, `<${tag}>`);
      } catch {}
      if (!success) {
        try {
          success = document.execCommand("formatBlock", false, tag);
        } catch {}
      }
    }

    saveSelection();
    updateActiveFormats();
    handleEditorInput();
    setTextStyleMenuOpen(false);
  };

  // 2. Bulleted List
  const handleBulletList = () => {
    if (!editorRef.current) return;
    ensureSelection();

    const currentHtml = editorRef.current.innerHTML.trim();
    if (!currentHtml || currentHtml === "<br>") {
      editorRef.current.innerHTML = "<ul><li><br></li></ul>";
      const li = editorRef.current.querySelector("li");
      if (li) {
        const range = document.createRange();
        range.setStart(li, 0);
        range.collapse(true);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        savedRangeRef.current = range.cloneRange();
      }
    } else {
      document.execCommand("insertUnorderedList", false, null);
    }

    saveSelection();
    updateActiveFormats();
    handleEditorInput();
  };

  // 3. Numbered List
  const handleOrderedList = () => {
    if (!editorRef.current) return;
    ensureSelection();

    const currentHtml = editorRef.current.innerHTML.trim();
    if (!currentHtml || currentHtml === "<br>") {
      editorRef.current.innerHTML = "<ol><li><br></li></ol>";
      const li = editorRef.current.querySelector("li");
      if (li) {
        const range = document.createRange();
        range.setStart(li, 0);
        range.collapse(true);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        savedRangeRef.current = range.cloneRange();
      }
    } else {
      document.execCommand("insertOrderedList", false, null);
    }

    saveSelection();
    updateActiveFormats();
    handleEditorInput();
  };

  // Text color
  const handleTextColor = (color) => {
    if (!editorRef.current) return;
    ensureSelection();
    document.execCommand("styleWithCSS", false, true);
    document.execCommand("foreColor", false, color);
    saveSelection();
    updateActiveFormats();
    handleEditorInput();
    setTextColorMenuOpen(false);
  };

  // Highlight / Background color
  const handleHighlightColor = (color) => {
    if (!editorRef.current) return;
    ensureSelection();
    document.execCommand("styleWithCSS", false, true);
    if (color === "transparent") {
      document.execCommand("hiliteColor", false, "transparent");
      try {
        document.execCommand("backColor", false, "transparent");
      } catch {}
    } else {
      try {
        document.execCommand("hiliteColor", false, color);
      } catch {
        document.execCommand("backColor", false, color);
      }
    }
    saveSelection();
    updateActiveFormats();
    handleEditorInput();
    setHighlightMenuOpen(false);
  };

  // ── DRAGGABLE HEADER HANDLER ───────────────────────────────────────
  const handleHeaderPointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;

    // Do NOT drag if clicking any button or interactive element in the header
    if (e.target.closest("button") || e.target.closest("input") || e.target.closest(".no-drag")) {
      return;
    }

    e.preventDefault();
    isDraggingRef.current = true;
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      noteX: position.x,
      noteY: position.y,
    };

    const onPointerMove = (moveEvent) => {
      if (!isDraggingRef.current) return;

      const dx = moveEvent.clientX - dragStartRef.current.pointerX;
      const dy = moveEvent.clientY - dragStartRef.current.pointerY;

      const maxLeft = Math.max(0, window.innerWidth - dimensions.width - 8);
      const maxTop = Math.max(0, window.innerHeight - dimensions.height - 8);

      const newX = Math.max(8, Math.min(maxLeft, dragStartRef.current.noteX + dx));
      const newY = Math.max(8, Math.min(maxTop, dragStartRef.current.noteY + dy));

      setPosition({ x: newX, y: newY });
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  };

  // ── RESIZE HANDLER ─────────────────────────────────────────────────
  const handleMouseDownResize = (e) => {
    e.preventDefault();
    isResizingRef.current = true;
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: dimensions.width,
      h: dimensions.height,
    };

    const handleMouseMove = (moveEvent) => {
      if (!isResizingRef.current) return;
      const dx = moveEvent.clientX - resizeStartRef.current.x;
      const dy = moveEvent.clientY - resizeStartRef.current.y;
      setDimensions({
        width: Math.max(340, Math.min(680, resizeStartRef.current.w + dx)),
        height: Math.max(250, Math.min(560, resizeStartRef.current.h + dy)),
      });
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        backgroundColor: activeTheme.bg,
      }}
      className="
        fixed z-[9999]
        rounded-2xl
        flex flex-col
        shadow-[0_16px_40px_rgba(0,0,0,0.16),0_4px_12px_rgba(0,0,0,0.06)]
        border border-black/10
        transition-colors duration-200
        select-none
      "
    >
      {/* ── 1. DRAGGABLE HEADER / TOP SECTION (~50px) ───────────────── */}
      <div
        onPointerDown={handleHeaderPointerDown}
        style={{ backgroundColor: activeTheme.header }}
        className="
          h-[50px] px-4 rounded-t-2xl
          flex items-center justify-between
          border-b border-black/10
          shrink-0
          cursor-grab active:cursor-grabbing
        "
      >
        {/* Left header area: note label (acts as drag handle) */}
        <div className="flex items-center gap-2 pointer-events-none">
          <span className="text-xs font-bold tracking-wider uppercase text-black/60 font-mono select-none">
            Sticky Note
          </span>
        </div>

        {/* Right header controls: [Color Selector] [Reminder/Bell] [Delete] [Minimize] */}
        <div className="flex items-center gap-2 no-drag">
          {/* Color Selector */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onClick={() => {
                setColorMenuOpen((prev) => !prev);
                setReminderMenuOpen(false);
                setDeleteConfirmOpen(false);
              }}
              title="Note Color"
              className="
                h-7 px-2 bg-white/90 hover:bg-white
                rounded-full flex items-center gap-1.5
                shadow-sm border border-black/10
                text-gray-700 transition
                cursor-pointer
              "
            >
              <span
                style={{ backgroundColor: activeTheme.indicator }}
                className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
              />
              <ChevronDown size={12} className="text-gray-600" />
            </button>

            {/* Color Palette Dropdown */}
            {colorMenuOpen && (
              <div
                className="
                  absolute top-9 right-0 w-44 p-2
                  bg-white rounded-xl shadow-xl border border-gray-200
                  z-[10000] grid grid-cols-3 gap-2 no-drag
                "
              >
                {NOTE_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => handleColorChange(theme.value)}
                    style={{ backgroundColor: theme.header }}
                    title={theme.name}
                    className={`
                      w-11 h-9 rounded-lg border flex items-center justify-center transition
                      hover:scale-105 cursor-pointer
                      ${
                        activeTheme.id === theme.id
                          ? "border-black/50 ring-2 ring-blue-500/40"
                          : "border-black/15"
                      }
                    `}
                  >
                    {activeTheme.id === theme.id && (
                      <Check size={14} className="text-gray-800" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reminder / Bell Button */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onClick={() => {
                setReminderMenuOpen((prev) => !prev);
                setColorMenuOpen(false);
                setDeleteConfirmOpen(false);
              }}
              title={noteData?.reminder_at ? "Reminder Active" : "Set Reminder"}
              className={`
                w-7 h-7 rounded-lg flex items-center justify-center transition cursor-pointer
                ${
                  noteData?.reminder_at
                    ? "bg-amber-400/50 text-amber-900 font-bold"
                    : "hover:bg-black/10 text-gray-800"
                }
              `}
            >
              <Bell size={15} />
              {noteData?.reminder_at && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-600" />
              )}
            </button>

            {/* Reminder Popover */}
            {reminderMenuOpen && (
              <div
                className="
                  absolute top-9 right-0 w-72 p-3.5
                  bg-white rounded-xl shadow-xl border border-gray-200
                  z-[10000] text-gray-800 text-xs no-drag
                "
              >
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <Clock size={14} /> Reminder
                  </span>
                  <button
                    type="button"
                    onClick={() => setReminderMenuOpen(false)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                {noteData?.reminder_at && (
                  <div className="mt-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                    <p className="font-medium text-[11px]">Active Reminder:</p>
                    <p className="text-xs font-semibold mt-0.5">
                      {new Date(noteData.reminder_at).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="mt-3">
                  <label className="text-[11px] font-medium text-gray-500 block mb-1">
                    Select Date & Time:
                  </label>
                  <input
                    type="datetime-local"
                    value={reminderDatetime}
                    onChange={(e) => setReminderDatetime(e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-gray-300 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Quick Presets */}
                <div className="mt-2.5 flex items-center gap-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleSetQuickReminder("1h")}
                    className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-[10px] text-gray-700 cursor-pointer"
                  >
                    +1 Hour
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetQuickReminder("tomorrow9")}
                    className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-[10px] text-gray-700 cursor-pointer"
                  >
                    Tomorrow 9 AM
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetQuickReminder("monday9")}
                    className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-[10px] text-gray-700 cursor-pointer"
                  >
                    Next Monday
                  </button>
                </div>

                {/* Actions */}
                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-1.5">
                  {noteData?.reminder_at ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCompleteReminder}
                        disabled={reminderSaving}
                        className="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-medium transition cursor-pointer"
                      >
                        Complete
                      </button>
                      <button
                        type="button"
                        onClick={handleClearReminder}
                        disabled={reminderSaving}
                        className="px-2 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-medium transition cursor-pointer"
                      >
                        Clear
                      </button>
                    </>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleSaveReminder}
                    disabled={reminderSaving || !reminderDatetime}
                    className="ml-auto px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium transition disabled:opacity-50 cursor-pointer"
                  >
                    {reminderSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Delete / Trash Button */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onClick={() => {
                setDeleteConfirmOpen((prev) => !prev);
                setColorMenuOpen(false);
                setReminderMenuOpen(false);
              }}
              title="Delete Note"
              className="w-7 h-7 rounded-lg hover:bg-red-500/20 hover:text-red-700 flex items-center justify-center transition text-gray-800 cursor-pointer"
            >
              <Trash2 size={15} />
            </button>

            {/* Delete Confirmation Popover */}
            {deleteConfirmOpen && (
              <div
                className="
                  absolute top-9 right-0 w-52 p-3
                  bg-white rounded-xl shadow-xl border border-gray-200
                  z-[10000] text-gray-800 text-xs no-drag
                "
              >
                <p className="font-medium text-gray-800 mb-2.5">
                  Delete this sticky note?
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmOpen(false)}
                    className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] text-gray-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteNote}
                    className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-medium cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Minimize Button */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={() => {
              flushAutosave();
              onClose();
            }}
            title="Minimize Note"
            className="w-7 h-7 rounded-lg hover:bg-black/10 flex items-center justify-center transition text-gray-800 cursor-pointer"
          >
            <Minus size={16} />
          </button>
        </div>
      </div>

      {/* ── 2. RICH TEXT TOOLBAR (Row 2, ~35px) ────────────────────────── */}
      <div
        style={{ backgroundColor: activeTheme.toolbar }}
        className="
          h-[35px] px-3 shrink-0
          border-b border-black/10
          flex items-center gap-1
          no-drag
        "
      >
        {/* [ T▼ ] Text style dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={() => {
              setTextStyleMenuOpen((prev) => !prev);
              setTextColorMenuOpen(false);
              setHighlightMenuOpen(false);
            }}
            title="Text Style"
            className={`
              h-6 px-1.5 rounded border border-black/25
              flex items-center gap-0.5 text-xs font-semibold
              transition cursor-pointer
              ${
                activeFormats.block && activeFormats.block !== "p"
                  ? "bg-black/15 text-black border-black/50"
                  : "text-gray-800 hover:bg-black/5"
              }
            `}
          >
            <span>
              {activeFormats.block === "h1"
                ? "H1"
                : activeFormats.block === "h2"
                ? "H2"
                : activeFormats.block === "h3"
                ? "H3"
                : "T"}
            </span>
            <ChevronDown size={10} />
          </button>

          {textStyleMenuOpen && (
            <div
              className="
                absolute top-7 left-0 w-32 py-1
                bg-white rounded-lg shadow-xl border border-gray-200
                z-[10000] text-gray-800 text-xs
              "
            >
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleFormatBlock("p")}
                className={`w-full px-3 py-1.5 text-left hover:bg-gray-100 cursor-pointer ${
                  activeFormats.block === "p" ? "font-bold bg-blue-50 text-blue-700" : ""
                }`}
              >
                Paragraph
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleFormatBlock("h1")}
                className={`w-full px-3 py-1.5 text-left font-bold text-sm hover:bg-gray-100 cursor-pointer ${
                  activeFormats.block === "h1" ? "bg-blue-50 text-blue-700" : ""
                }`}
              >
                Heading 1
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleFormatBlock("h2")}
                className={`w-full px-3 py-1.5 text-left font-semibold text-xs hover:bg-gray-100 cursor-pointer ${
                  activeFormats.block === "h2" ? "bg-blue-50 text-blue-700" : ""
                }`}
              >
                Heading 2
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleFormatBlock("h3")}
                className={`w-full px-3 py-1.5 text-left font-medium text-xs hover:bg-gray-100 cursor-pointer ${
                  activeFormats.block === "h3" ? "bg-blue-50 text-blue-700" : ""
                }`}
              >
                Heading 3
              </button>
            </div>
          )}
        </div>

        {/* [ B ] Bold */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={() => execFormat("bold")}
          title="Bold (Ctrl+B)"
          className={`
            w-6 h-6 rounded flex items-center justify-center transition cursor-pointer text-xs font-bold
            ${
              activeFormats.bold
                ? "bg-black/20 text-black shadow-inner"
                : "hover:bg-black/10 text-gray-800"
            }
          `}
        >
          <Bold size={13} />
        </button>

        {/* [ I ] Italic */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={() => execFormat("italic")}
          title="Italic (Ctrl+I)"
          className={`
            w-6 h-6 rounded flex items-center justify-center transition cursor-pointer text-xs
            ${
              activeFormats.italic
                ? "bg-black/20 text-black shadow-inner font-semibold"
                : "hover:bg-black/10 text-gray-800"
            }
          `}
        >
          <Italic size={13} />
        </button>

        {/* [ U ] Underline */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={() => execFormat("underline")}
          title="Underline (Ctrl+U)"
          className={`
            w-6 h-6 rounded flex items-center justify-center transition cursor-pointer text-xs
            ${
              activeFormats.underline
                ? "bg-black/20 text-black shadow-inner font-semibold"
                : "hover:bg-black/10 text-gray-800"
            }
          `}
        >
          <Underline size={13} />
        </button>

        {/* [ S ] Strikethrough */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={() => execFormat("strikeThrough")}
          title="Strikethrough"
          className={`
            w-6 h-6 rounded flex items-center justify-center transition cursor-pointer text-xs
            ${
              activeFormats.strike
                ? "bg-black/20 text-black shadow-inner font-semibold"
                : "hover:bg-black/10 text-gray-800"
            }
          `}
        >
          <Strikethrough size={13} />
        </button>

        {/* [ A ] Text color */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={() => {
              setTextColorMenuOpen((prev) => !prev);
              setTextStyleMenuOpen(false);
              setHighlightMenuOpen(false);
            }}
            title="Text Color"
            className="w-6 h-6 rounded hover:bg-black/10 flex flex-col items-center justify-center text-gray-800 transition cursor-pointer relative"
          >
            <span className="text-xs font-bold leading-none">A</span>
            <span className="w-3 h-0.5 bg-red-500 mt-0.5 rounded-full" />
          </button>

          {textColorMenuOpen && (
            <div
              className="
                absolute top-7 left-0 w-32 p-2
                bg-white rounded-lg shadow-xl border border-gray-200
                z-[10000] grid grid-cols-3 gap-1.5
              "
            >
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleTextColor(c.value)}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                  className="w-7 h-7 rounded border border-gray-300 hover:scale-110 transition cursor-pointer"
                />
              ))}
            </div>
          )}
        </div>

        {/* [ A ] Highlight / Background color */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={() => {
              setHighlightMenuOpen((prev) => !prev);
              setTextStyleMenuOpen(false);
              setTextColorMenuOpen(false);
            }}
            title="Highlight Color"
            className="w-6 h-6 rounded hover:bg-black/10 flex items-center justify-center text-gray-800 transition cursor-pointer"
          >
            <Highlighter size={13} />
          </button>

          {highlightMenuOpen && (
            <div
              className="
                absolute top-7 left-0 w-36 p-2
                bg-white rounded-lg shadow-xl border border-gray-200
                z-[10000] grid grid-cols-3 gap-1.5
              "
            >
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleHighlightColor(c.value)}
                  style={{ backgroundColor: c.value === "transparent" ? "#F3F4F6" : c.value }}
                  title={c.name}
                  className="w-8 h-7 rounded border border-gray-300 hover:scale-110 transition flex items-center justify-center text-[10px] text-gray-600 font-medium cursor-pointer"
                >
                  {c.value === "transparent" ? "None" : ""}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* [ • ] Bulleted list */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={handleBulletList}
          title="Bulleted List"
          className={`
            w-6 h-6 rounded flex items-center justify-center transition cursor-pointer text-xs
            ${
              activeFormats.bullet
                ? "bg-black/20 text-black shadow-inner font-semibold"
                : "hover:bg-black/10 text-gray-800"
            }
          `}
        >
          <List size={14} />
        </button>

        {/* [ 1. ] Numbered list */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={handleOrderedList}
          title="Numbered List"
          className={`
            w-6 h-6 rounded flex items-center justify-center transition cursor-pointer text-xs
            ${
              activeFormats.ordered
                ? "bg-black/20 text-black shadow-inner font-semibold"
                : "hover:bg-black/10 text-gray-800"
            }
          `}
        >
          <ListOrdered size={14} />
        </button>
      </div>

      {/* ── 3. EDITOR AREA ────────────────────────────────────────── */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ backgroundColor: activeTheme.bg }}
      >
        <div
          ref={editorRef}
          contentEditable="true"
          suppressContentEditableWarning={true}
          onInput={handleEditorInput}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          onSelect={saveSelection}
          data-placeholder="Take a note..."
          style={{
            color: activeTheme.text,
            caretColor: "#111827",
          }}
          className="
            sticky-note-editor
            w-full h-full
            px-5 py-4
            text-[15px] leading-relaxed
            outline-none
            overflow-y-auto
            cursor-text
            select-text
          "
        />
      </div>

      {/* ── 4. RESIZE HANDLE (Bottom-Right Corner) ────────────────── */}
      <div
        onMouseDown={handleMouseDownResize}
        title="Resize"
        className="
          absolute bottom-0 right-0 w-4 h-4
          cursor-nwse-resize
          flex items-end justify-end p-0.5
          text-black/30 hover:text-black/60
          no-drag
        "
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <circle cx="8" cy="8" r="1" />
          <circle cx="5" cy="8" r="1" />
          <circle cx="8" cy="5" r="1" />
          <circle cx="2" cy="8" r="1" />
          <circle cx="5" cy="5" r="1" />
          <circle cx="8" cy="2" r="1" />
        </svg>
      </div>
    </div>
  );
}
