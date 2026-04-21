"use client";
import { useDropzone, FileRejection } from "react-dropzone";
import { FileUpIcon, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ClientDropzone({
  value,
  setValue,
}: {
  value: File | null;
  setValue: (file: File | null) => void;
}) {
  const onDropAccepted = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setValue(selectedFile);
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    isDragActive,
    inputRef,
  } = useDropzone({
    onDropAccepted,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
    onDropRejected: (fileRejections: FileRejection[]) => {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === "file-too-large")
            toast.error(`"${file.name}" is too large.`);
          else if (error.code === "file-invalid-type")
            toast.error(`"${file.name}" is not a PDF.`);
        });
      });
    },
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <section className="w-full">
        <div {...getRootProps()}>
          <input {...getInputProps()} name="cv" />

          <div
            className={`
                relative flex flex-col items-center justify-center p-12 border-2 border-dashed
                cursor-pointer rounded-2xl bg-background/80 transition-all duration-200
                ${
                  isDragReject
                    ? "border-red-500 bg-red-500/5 scale-[0.99]"
                    : isDragAccept
                      ? "border-green-500 scale-[1.01] bg-green-500/5"
                      : "border-border hover:border-primary/40"
                }
              `}
          >
            <div
              className={`p-4 mb-4 rounded-xl transition-colors duration-200 ${
                isDragReject
                  ? "bg-red-500/20"
                  : isDragAccept
                    ? "bg-green-600/80"
                    : value && !isDragActive
                      ? "dark:bg-zinc-400/20 bg-primary/60"
                      : "dark:bg-zinc-400/20 bg-primary/25"
              }`}
            >
              {value && !isDragActive ? (
                <CheckCircle2 className="dark:text-green-400 text-white" />
              ) : (
                <FileUpIcon
                  className={`size-6 transition-colors duration-200 ${
                    isDragReject ? "text-red-500" : ""
                  }`}
                />
              )}
            </div>

            <div className="font-bold text-center">
              {isDragReject ? (
                "Invalid value type"
              ) : isDragAccept ? (
                "Drop it!"
              ) : value ? (
                <>
                  <p className="font-bold text-sm truncate max-w-[200px]">
                    {value.name}
                  </p>
                  <p className="text-xs text-center text-secondary-foreground/50">
                    {(value.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                "Drag & Drop CV"
              )}
            </div>

            <p
              className={`text-sm mt-1 transition-colors duration-200 ${
                isDragReject
                  ? "text-red-400"
                  : "dark:text-secondary-foreground/50 text-primary/80"
              }`}
            >
              {isDragReject
                ? "Only PDFs up to 5MB"
                : value && !isDragActive
                  ? ""
                  : "PDF (Max 5MB)"}
            </p>

            {value && !isDragActive && (
              <Button
                variant={null}
                type="button"
                onClick={handleRemove}
                className="absolute top-3 right-3 px-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="size-4 text-secondary-foreground/60" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
