import { MemberObj } from "../../../types/component.types";
import BoardMember from "./BoardMember";

interface Props {
  boardId?: string;
  workspaceId?: string;
  members: MemberObj[];
  role?: string;
}

function BoardMembers({ boardId, workspaceId, role, members }: Props) {
  const boardAdmins = members.filter(
    (member: MemberObj) => member.role === "ADMIN"
  );

  return (
    <div className="bg-slate-200 py-1 rounded mt-2 px-1">
      {members.length > 0 ? (
        <div className="flex gap-1 items-center">
          {members.map((member: MemberObj) => {
            return (
              <BoardMember
                key={member._id}
                boardId={boardId}
                member={member}
                boardAdmins={boardAdmins}
                myRole={role}
                workspaceId={workspaceId}
              />
            );
          })}
        </div>
      ) : (
        <div>No Members</div>
      )}
    </div>
  );
}

export default BoardMembers;
