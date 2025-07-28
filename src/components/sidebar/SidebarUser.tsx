import { Session } from "next-auth";
import Image from "next/image";

interface SidebarUserProps {
  session: Session | null;
  onOpenPopover: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function SidebarUser({
  session,
  onOpenPopover,
}: SidebarUserProps) {
  if (!session) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3 cursor-pointer" onClick={onOpenPopover}>
      <Image
        className="h-8 w-8 rounded-full"
        src={session.user?.image || '/default-avatar.png'} // Use a default image if none is provided
        alt="User avatar"
        width={32}
        height={32}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {session.user?.name || 'User'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {session.user?.email || 'user@example.com'}
        </p>
      </div>
    </div>
  );
}