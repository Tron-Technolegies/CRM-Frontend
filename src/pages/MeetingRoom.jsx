import { useCallback, useEffect, useRef } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useNavigate, useParams } from "react-router-dom";
import useMeetingRoom from "../hooks/useMeetingRoom";

export default function MeetingRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    meeting,
    loading,
    error,
    authorizeMeeting,
    startAttendance,
    endAttendance,
  } = useMeetingRoom();

  const apiRef = useRef(null);

  const attendanceStartedRef = useRef(false);
  const attendanceEndedRef = useRef(false);
  const attendanceEndingRef = useRef(false);
  const meetingIdRef = useRef(id);

  useEffect(() => {
    meetingIdRef.current = id;
  }, [id]);

    useEffect(() => {
    const handlePageExit = () => {
      const meetingId = meetingIdRef.current;

      if (!meetingId) return;
      if (!attendanceStartedRef.current) return;
      if (attendanceEndedRef.current) return;
      if (attendanceEndingRef.current) return;

      const token = localStorage.getItem("access_token");

      if (!token) return;

      const apiRoot = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
      const url = `${apiRoot}/api/admin/meeting/attendance/leave/${meetingId}/`;

      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        keepalive: true,
      });

      attendanceEndedRef.current = true;
    };

    window.addEventListener("pagehide", handlePageExit);

    return () => {
      window.removeEventListener("pagehide", handlePageExit);
    };
  }, []);

  useEffect(() => {
    attendanceStartedRef.current = false;
    attendanceEndedRef.current = false;
    attendanceEndingRef.current = false;
  }, [id]);

  /*
   * -----------------------------------------
   * AUTHORIZE MEETING
   * -----------------------------------------
   */
  useEffect(() => {
    authorizeMeeting(id);
  }, [id, authorizeMeeting]);

  /*
   * -----------------------------------------
   * JITSI CONFERENCE JOINED
   * -----------------------------------------
   */
  const handleConferenceJoined = useCallback(async () => {
    if (attendanceStartedRef.current) {
      console.log("Attendance already started.");
      return;
    }

    attendanceStartedRef.current = true;

    console.log("JaaS: User joined conference");

    try {
      const result = await startAttendance(id);

      console.log("CRM ATTENDANCE RECORDED: JOINED", result);
    } catch (err) {
      console.error("Failed to record meeting attendance:", err);

      // Allow retry if the API failed
      attendanceStartedRef.current = false;
    }
  }, [id, startAttendance]);

  /*
   * -----------------------------------------
   * JITSI CONFERENCE LEFT
   * -----------------------------------------
   */
  const handleConferenceLeft = useCallback(async () => {
    if (attendanceEndedRef.current || attendanceEndingRef.current) {
      console.log("Attendance leave already handled.");
      return;
    }

    attendanceEndingRef.current = true;

    console.log("JaaS: User left conference");

    try {
      const result = await endAttendance(id);

      console.log("CRM ATTENDANCE RECORDED: LEFT", result);
    } catch (err) {
      console.error("Failed to record meeting leave:", err);
    } finally {
      attendanceEndedRef.current = true;
      navigate("/meetings");
    }
  }, [id, endAttendance, navigate]);

  /*
   * -----------------------------------------
   * CLEANUP
   * -----------------------------------------
   */
  useEffect(() => {
    return () => {
      if (apiRef.current) {
        try {
          apiRef.current.removeListener(
            "videoConferenceJoined",
            handleConferenceJoined,
          );

          apiRef.current.removeListener(
            "videoConferenceLeft",
            handleConferenceLeft,
          );
        } catch (err) {
          console.error("Failed to remove JaaS listeners:", err);
        }
      }
    };
  }, [handleConferenceJoined, handleConferenceLeft]);

  /*
   * -----------------------------------------
   * LOADING
   * -----------------------------------------
   */
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white">
        <p>Checking meeting access...</p>
      </div>
    );
  }

  /*
   * -----------------------------------------
   * ERROR
   * -----------------------------------------
   */
  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900">
            Unable to Join Meeting
          </h2>

          <p className="text-sm text-gray-500 mt-2">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/meetings")}
            className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Meetings
          </button>
        </div>
      </div>
    );
  }

  /*
   * -----------------------------------------
   * NO MEETING DATA
   * -----------------------------------------
   */
  if (!meeting) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white">
        <p>Meeting information not available.</p>
      </div>
    );
  }

  /*
   * -----------------------------------------
   * MEETING ROOM
   * -----------------------------------------
   */
  return (
    <div className="fixed inset-0 z-[9999] bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="h-16 bg-gray-950 text-white flex items-center justify-between px-6 shrink-0">
        <div>
          <h1 className="font-semibold">{meeting.title}</h1>

          <p className="text-xs text-gray-400">Role: {meeting.role}</p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (apiRef.current) {
              apiRef.current.executeCommand("hangup");
            } else {
              navigate("/meetings");
            }
          }}
          className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm"
        >
          Leave
        </button>
      </div>

      {/* JaaS Meeting */}
      <div className="flex-1 min-h-0 w-full">
        <JitsiMeeting
          domain={meeting.jaasDomain}
          roomName={meeting.jaasRoomName}
          jwt={meeting.jwt}
          configOverwrite={{
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            disableModeratorIndicator: false,
          }}
          interfaceConfigOverwrite={{
            MIRROR_LOCAL_VIDEO: true,

            TOOLBAR_BUTTONS: [
              "microphone",
              "camera",
              "desktop",
              "chat",
              "participants-pane",
              "tileview",
              "fullscreen",
            ],
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.width = "100%";
            iframeRef.style.height = "100%";
            iframeRef.style.border = "0";
          }}
          onApiReady={(externalApi) => {
            apiRef.current = externalApi;

            console.log("JaaS API ready");

            externalApi.addListener(
              "videoConferenceJoined",
              handleConferenceJoined,
            );

            externalApi.addListener(
              "videoConferenceLeft",
              handleConferenceLeft,
            );
          }}
          onReadyToClose={() => {
            if (!attendanceEndedRef.current) {
              handleConferenceLeft();
            }
          }}
        />
      </div>
    </div>
  );
}
