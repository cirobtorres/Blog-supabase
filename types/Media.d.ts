type SupabaseBucketImage = {
  url: string;
  name: string;
  bucket_id: string;
  owner: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>; // metadata.mimetype (file type)
  buckets: Bucket;
};

type ImageStateProps = SupabaseBucketImage & { width: number; height: number };
