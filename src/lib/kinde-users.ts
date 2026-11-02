import { Users, init as kindeInit } from "@kinde/management-api-js";

export async function listKindeUsers() {
  kindeInit();
  const users: NonNullable<Awaited<ReturnType<typeof Users.getUsers>>["users"]> = [];
  let nextToken: string | undefined;

  do {
    const response = await Users.getUsers({ pageSize: 100, nextToken });
    users.push(...(response.users ?? []));
    nextToken = response.next_token ?? undefined;
  } while (nextToken);

  return users;
}
