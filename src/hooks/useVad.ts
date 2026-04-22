import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

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
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

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

  return {
    transcript,
    finalTranscript,
    isListening: listening,
    clearTranscript: () => {
      resetTranscript();
      setFinalTranscript("");
    },
    isMicAvailable: isMicrophoneAvailable,
    isBrowserSupported: browserSupportsSpeechRecognition,
  };
}