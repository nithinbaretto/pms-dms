import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

type CameraCaptureModalProps = {
  title: string;
  onCancel: () => void;
  onSave: (file: File) => Promise<void> | void;
};

const CameraCaptureModal = ({
  title,
  onCancel,
  onSave,
}: CameraCaptureModalProps): ReactElement => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera is not supported on this device/browser.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "user" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        video.srcObject = stream;
        video.playsInline = true;
        video.muted = true;
        await video.play();

        await new Promise<void>((resolve) => {
          const tryReady = () => {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              resolve();
            }
          };

          video.onloadeddata = tryReady;
          video.onplaying = tryReady;
          tryReady();
          window.setTimeout(resolve, 1500);
        });

        if (!cancelled) {
          setIsReady(true);
        }
      } catch {
        if (!cancelled) {
          setError("Camera permission denied or camera unavailable.");
        }
      }
    }

    void startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  async function handleSave() {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    setIsSaving(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.92);
      });
      if (!blob) {
        return;
      }

      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
      await onSave(file);
    } finally {
      setIsSaving(false);
    }
  }

  const saveDisabled = !isReady || isSaving || Boolean(error);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 overflow-y-auto backdrop-blur-[3px] bg-[rgba(35,31,32,0.5)]" onClick={onCancel} />
      <div className="relative bg-white rounded-[16px] drop-shadow-[4px_4px_20px_rgba(0,0,0,0.12)] flex flex-col gap-[16px] p-[20px] md:p-[32px] w-[calc(100%-32px)] max-w-[679.5px]">
        <div className="flex h-[33px] items-center justify-between w-full shrink-0">
          <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#435160] text-[22px] whitespace-nowrap">{title}</p>
          <button type="button" onClick={onCancel} className="overflow-clip size-[24px] hover:opacity-70 transition-opacity" aria-label="Close">
            <svg className="size-full" fill="none" viewBox="0 0 15 15">
              <path d="M1.5 1.5L13.5 13.5M13.5 1.5L1.5 13.5" stroke="#435160" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="relative rounded-[8px] w-full border border-dotted border-[#EEEEEE]">
          <div className="flex flex-col items-center justify-center p-[12px]">
            <div className="relative w-full overflow-hidden bg-black" style={{ height: "211px" }}>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-contain"
              />
              {!isReady && !error ? (
                <p className="absolute inset-0 flex items-center justify-center font-['Mulish',sans-serif] text-[14px] text-white">
                  Starting camera...
                </p>
              ) : null}
              {error ? (
                <p className="absolute inset-0 flex items-center justify-center px-[16px] text-center font-['Mulish',sans-serif] text-[14px] text-white">
                  {error}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex gap-[24px] items-center w-full shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-[36px] rounded-[8px] border border-[#eee] flex items-center justify-center hover:border-[#c7aa7b] transition-colors"
          >
            <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Cancel</p>
          </button>
          <button
            type="button"
            onClick={() => {
              void handleSave();
            }}
            disabled={saveDisabled}
            className={`flex-1 h-[36px] rounded-[8px] flex items-center justify-center transition-colors ${
              saveDisabled ? "bg-[#e5e5e6] cursor-not-allowed" : "bg-[#93161e] hover:bg-[#7a1319] cursor-pointer"
            }`}
          >
            <p className={`font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] ${saveDisabled ? "text-[#5a6b7d]" : "text-white"}`}>
              {isSaving ? "Saving..." : "Save"}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraCaptureModal;
