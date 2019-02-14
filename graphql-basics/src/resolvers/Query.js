const Query = {
    comments(parent, args, ctx, info) {
        return ctx.db.comments
    },
    users(parent, args, ctx, info){
        if(args.query){
            return ctx.db.users.filter((user) => {
                return user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
            })
        } else {
            return ctx.db.users
        }
    },
    posts(parent, args, ctx, info){
        if(args.query){
            return ctx.db.posts.filter((post) => {
                return post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()) 
                || post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
            })
        } else {
            return ctx.db.posts
        }
    },
    me(){
        return {
            id: '123456',
            name: 'German',
            email: 'gvalenncia@gmail.com'
        }
    },
    post(){
        return {
            id: '888',
            title: 'new post',
            body: 'asdfasdf'
        }
    }
}

export { Query as default }