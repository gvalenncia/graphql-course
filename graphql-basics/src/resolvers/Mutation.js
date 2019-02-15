
import uuidv4 from 'uuid/v4'

const Mutation = {
    createUser(parent, args, ctx, info){
        const emailTaken = ctx.db.users.some((user) => {
            return user.email === args.data.email
        })

        if(emailTaken){
            throw new Error('The email is already taken')
        } else {

            const user = {
                id: uuidv4(),
                ...args.data
            }

            ctx.db.users.push(user)
            return user
        }
    },
    deleteUser(parent, args, ctx, info){
        const userIndex = ctx.db.users.findIndex((user)=> user.id === args.id)

        if(userIndex === -1){
            throw new Error('User not found')
        } else {
            const deletedUser = ctx.db.users.splice(userIndex, 1)
            ctx.db.posts = ctx.db.posts.filter((post) => {
                const match = post.author === args.id
                if(match){
                    ctx.db.comments = ctx.db.comments.filter((comment) => comment.post !== post.id )
                }
                return !match
            })
            ctx.db.comments = ctx.db.comments.filter((comment)=> comment.author!== args.id )

            return deletedUser[0]
        }
    },
    updateUser(parent, args, ctx, info){
        const { id, data } = args
        const user = ctx.db.users.find((user) => user.id === id)

        if(!user){
            throw new Error('User not found')
        } 

        if(typeof data.email === 'string') {
            const emailTaken = ctx.db.users.some((user) => user.email === data.email)

            if(emailTaken) {
                throw new Error('Email taken')
            }

            user.email = data.email
        }

        if(typeof data.name === 'string'){
            user.name = data.name
        }

        if(typeof data.age !== 'undefined'){
            user.age = data.age
        }

        return user
    },
    createPost(parent, args, ctx, info){
        const userExists = ctx.db.users.some((user) => user.id === args.data.author)
        
        if(!userExists) {
            throw new Error('User not found')
        } else {
            const post = {
                id: uuidv4(),
                ...args.data
            }

            ctx.db.posts.push(post)
            return post
        }
    },
    deletePost(parent, args, ctx, info){
        const postIndex = ctx.db.posts.findIndex((post)=> post.id === args.id)

        if(postIndex === -1){
            throw new Error('Post not found')
        } else {
            const deletedPosts = ctx.db.posts.splice(postIndex, 1)
            ctx.db.comments = ctx.db.comments.filter((comment) => {
                return !(comment.post === args.id)
            })
            return deletedPosts[0]
        }
    },
    createComment(parent, args, ctx, info){
        const userExists = ctx.db.users.some((user) => user.id === args.data.author)
        const postExists = ctx.db.posts.some((post) => post.id === args.data.post)

        if(!userExists || !postExists){
            throw new Error('The author or the post do not exist')
        } else {
            const comment = {
                id: uuidv4(),
                ...args.data
            }

            ctx.db.comments.push(comment)
            return comment
        }

    },
    deleteComment(parent, args, ctx, info){
        const commentIndex = ctx.db.comments.findIndex((comment)=> comment.id === args.id)

        if(commentIndex === -1){
            throw new Error('Commnet not found')
        } else {
            const deletedComments = ctx.db.comments.splice(commentIndex, 1)
            return deletedComments[0]
        }
    }
}

export { Mutation as default }