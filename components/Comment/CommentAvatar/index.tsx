import Image from "next/image";

export default function CommentAvatar({ profile }: { profile: ProfileSafe }) {
  return (
    <Image
      src={profile.avatar_url ?? "/images/not-authenticated.png"}
      alt={profile ? `Avatar de ${profile.avatar_url}` : "Avatar anônimo"}
      width={40}
      height={40}
      className="rounded-full"
    />
  );
}
