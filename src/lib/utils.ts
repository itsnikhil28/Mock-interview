import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DocumentData } from "firebase/firestore";
import { LiveInterview } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Interview = DocumentData; // Firestore stores generic objects
type User = DocumentData;

// ✅ Helper function to handle Firestore timestamps, strings, or numbers
const convertToDate = (value: any): Date => {
  if (!value) return new Date();
  return value.toDate ? value.toDate() : new Date(value);
};

export const groupInterviews = (interviews: Interview[]) => {
  if (!interviews) return {};

  return interviews.reduce((acc: any, interview: Interview) => {
    const date = convertToDate(interview.startTime); // ✅ Converted to Date
    const now = new Date();

    if (interview.status === "succeeded") {
      acc.succeeded = [...(acc.succeeded || []), interview];
    } else if (interview.status === "failed") {
      acc.failed = [...(acc.failed || []), interview];
    } else if (date < now) {
      acc.completed = [...(acc.completed || []), interview];
    } else {
      acc.upcoming = [...(acc.upcoming || []), interview];
    }

    return acc;
  }, {});
};

export const getCandidateInfo = (users: User[], candidateId: string) => {
  const candidate = users?.find((user) => user.clerkId === candidateId);
  return {
    name: candidate?.name || "Unknown Candidate",
    image: candidate?.image || "",
    initials:
      candidate?.name
        ?.split(" ")
        .map((n: any) => n[0])
        .join("") || "UC",
  };
};

export const getInterviewerInfo = (users: User[], interviewerId: string) => {
  const interviewer = users?.find((user) => user.clerkId === interviewerId);
  return {
    name: interviewer?.name || "Unknown Interviewer",
    image: interviewer?.image || "",
    initials:
      interviewer?.name
        ?.split(" ")
        .map((n: any) => n[0])
        .join("") || "UI",
  };
};

export const calculateRecordingDuration = (startTime: any, endTime: any) => {
  const start = convertToDate(startTime); // ✅ Converted to Date
  const end = convertToDate(endTime);

  const diffInSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  if (minutes > 0) {
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  return `${seconds} seconds`;
};

export const getMeetingStatus = (liveinterview: LiveInterview) => {
  const now = new Date();
  const interviewStartTime = convertToDate(liveinterview.startTime); // ✅ Converted to Date
  const endTime = new Date(interviewStartTime.getTime() + 60 * 60 * 1000); // Add 1 hour

  if (
    liveinterview.status === "completed" ||
    liveinterview.status === "failed" ||
    liveinterview.status === "succeeded"
  ) {
    return "completed";
  }
  if (now >= interviewStartTime && now <= endTime) return "live";
  if (now < interviewStartTime) return "upcoming";
  return "completed";
};
