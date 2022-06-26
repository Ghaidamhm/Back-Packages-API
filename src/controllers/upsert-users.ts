export function upsertUsersControllers(users: any[], newUsers: any){
    const userIndex=users.findIndex((u)=> u.id===newUsers.id);
    if(userIndex ===-1){
        users.push(newUsers);
    }else{
        users[userIndex]={
            ...users[userIndex],
            ...newUsers,
        };
    }
    return users;
}