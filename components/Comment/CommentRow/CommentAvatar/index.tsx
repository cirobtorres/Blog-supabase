import Image from "next/image";

export default function CommentAvatar({ profile }: { profile: Profile }) {
  return (
    <Image
      src={profile.avatar_url}
      alt={`Avatar de ${profile.avatar_url}`}
      width={40}
      height={40}
      className="rounded-full"
    />
  );
}
