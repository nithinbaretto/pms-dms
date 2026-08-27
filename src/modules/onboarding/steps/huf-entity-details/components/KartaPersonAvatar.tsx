import type { ReactElement } from "react";
import { UserRound } from "lucide-react";

import { cn } from "../../../../../shared/ui/utils";

type KartaPersonAvatarProps = {
  className?: string;
  iconClassName?: string;
};

const KartaPersonAvatar = ({
  className,
  iconClassName,
}: KartaPersonAvatarProps): ReactElement => {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0E5]",
        className,
      )}
    >
      <UserRound className={cn("size-5 text-[#93161E]", iconClassName)} strokeWidth={1.75} />
    </span>
  );
};

export default KartaPersonAvatar;
