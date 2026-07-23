import {
  getCalls,
  createCall,
  updateCall,
  deleteCall,
} from "../api/call";

export function useCalls() {
  return {
    getCalls,
    createCall,
    updateCall,
    deleteCall,
  };
}