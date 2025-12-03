type SupabaseBucketMedia = {
  url: string;
  name: string;
  bucket_id: string;
  owner: string;
  id: string;
  updated_at: string | null;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>; // metadata = {
  //   eTag: string, // uuid
  //   size: number,
  //   mimetype: string, // Ex: image/jpeg
  //   cacheControl: string, // Ex: max-age=3600
  //   lastModified: Date,
  //   contentLength: number,
  //   httpStatusCode: number
  // }
  buckets: Bucket;
  url: string;
  media_metadata: {
    id: string;
    storage_path: string;
    mime_type: string;
    metadata: {
      height?: number;
      width?: number;
      altText?: string;
      caption?: string;
    };
    updated_at: string | null;
    created_at: Date;
  };
};

// ---
type DragAndDropZoneProp = {
  imageFile: FileWithMetadata | null;
  openStep: "upload" | "preview" | null;
  previewUrl: string | null;
  setImageFile: (value: FileWithMetadata | null) => void;
  setOpenStep: (value: "upload" | "preview" | null) => void;
  setPreviewUrl: (value: string | null) => void;
  onFileSelected: (files: File) => void;
};

type DragAndDropZoneProps = {
  onFilesSelected: (files: File[]) => void;
};

type FileWithMetadata = {
  file: File;
  filename: string;
  caption: string;
  altText: string;
};
type FileWithMetadataTemp = FileWithMetadata & { blocked: boolean };

type FilePreviewCardProps = {
  data: FileWithMetadataTemp;
  index: number;
  updateFiles: (index: number, updates: Partial<FileWithMetadata>) => void;
  removeFiles: (file: File) => void;
};

type ExitButtonProps = {
  onConfirm: () => void;
  children: React.ReactNode;
};
