<<<<<<< HEAD
import { useEffect, useRef, useState } from "react";
=======
"use client";

import { useEffect, useRef } from "react";
>>>>>>> d0a831756d196fa618c9648c7b1249d9f73ce17a
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

<<<<<<< HEAD
type UseSpeechProps = {
  enabled: boolean;
  silenceTimeout_ms?: number;
  language?: string;
};

export function useSpeech({
  enabled,
  silenceTimeout_ms = 4000,
  language = "en-US",
}: UseSpeechProps) {

  const {
    transcript,
=======
type vadOptions = {
  silenceTimeout_ms?: number;
  language?: "en-US" | "ar-EG";
  enabled?: boolean; // New flag to control auto-start
};

export const useVad = ({
  silenceTimeout_ms = 1500,
  language = "en-US",
  enabled = false,
}: vadOptions = {}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    transcript,
    finalTranscript,
>>>>>>> d0a831756d196fa618c9648c7b1249d9f73ce17a
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

<<<<<<< HEAD
  const [finalTranscript, setFinalTranscript] = useState("");

  const silenceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      return;
    }

    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
    }

    if (transcript.trim().length > 0) {
      silenceTimer.current = setTimeout(() => {
        setFinalTranscript(transcript);
      }, silenceTimeout_ms);
    }

    return () => {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    };
  }, [transcript, enabled, silenceTimeout_ms]);

  useEffect(() => {
    if (enabled) {
      SpeechRecognition.startListening({
        continuous: true,
        language,
      });
    } else {
      SpeechRecognition.stopListening();
    }

    return () => {
      SpeechRecognition.stopListening();
    };

  }, [enabled, language]);
=======
  // Trigger listening only when enabled is true
  useEffect(() => {
    if (enabled && browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true, language });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [enabled, browserSupportsSpeechRecognition, language]);

  // VAD Logic: Stop after silence
  useEffect(() => {
    if (transcript && listening) {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        SpeechRecognition.stopListening();
        // Trigger AI Agent here
      }, silenceTimeout_ms);
    }
  }, [transcript, listening, silenceTimeout_ms]);
>>>>>>> d0a831756d196fa618c9648c7b1249d9f73ce17a

  return {
    transcript,
    finalTranscript,
    isListening: listening,
<<<<<<< HEAD
    clearTranscript: () => {
      resetTranscript();
      setFinalTranscript("");
    },
    isMicAvailable: isMicrophoneAvailable,
    isBrowserSupported: browserSupportsSpeechRecognition,
  };
}
=======
    clearTranscript: resetTranscript,
    isBrowserSupported: browserSupportsSpeechRecognition,
    isMicAvailable: isMicrophoneAvailable,
  } as const;
};
>>>>>>> d0a831756d196fa618c9648c7b1249d9f73ce17a
