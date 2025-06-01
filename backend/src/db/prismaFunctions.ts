import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export async function client (url: string) {
    const createClient = await new PrismaClient({
		datasourceUrl: url
	}).$extends(withAccelerate())
    return createClient;
}
export async function createUser ( prisma: any, body: {email: string, password: string, name?: string} ) {
    
    try {
        const res = await prisma.user.create({
            data: body,
            select: {
                id: true,
                name: true,
                email: true,
                posts: true,             
            }
        });
        if (res) {
            return res;
        } else {
            return null;
        };
    } catch (err) {
        return null;
    };
}

export async function findUser (prisma: any, options: {
    email? : string;
    id? : string
}) {

    try {
        const res = await prisma.user.findUnique({
            where: options
        });
        if (res) {
            return res;
        } else {
            return null;
        };
    } catch (err) {
        return null;
    };

}

// model User {
//   id              String        @id @default(uuid()) // to make id a string,
//   email           String        @unique
//   name            String    
//   password        String    
//   posts           Post[]
//   comments        Comments[]
// }

export async function userLogin (prisma: any, options: {
    email : string;
    password : string
}) {

    try {
        const res = await prisma.user.findUnique({
            where: options,
            select: {
                id: true,
                name: true,
                email: true,
                posts: true,
            }
        });
        if (res) {
            return res;
        } else {
            return null;
        };
    } catch (err) {
        return null;
    };
}


export async function createBlog(prisma: any, body: {
    title: string;
    summary: string;
    content: string;
    editorState: string;
    imageExist: boolean;
    published: boolean;
    date: string;
    authorId: string;
}) {
    try {
        const res = await prisma.post.create({
            data: body,
        })
        if (res) {
            return res;
        } else {
            
            return null;
        }
    } catch (err) {
        console.log(err)
        return null;
    }
}

export async function deleteBlog(prisma: any, id: string) {
    try {
        const res = await prisma.post.delete({
            where: {
                id
            }
        })
        if (res) {
            return res;
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
}


export async function updateBlog(prisma: any, id: string, body: {
    title?: string;
    content?: string;
    published?: boolean;
}) {

    try {
        const res = await prisma.post.update({
            where: {
                id,
            }, 
            data: body
        })
        if (res) {
            return res;
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
}


export async function getBlog(prisma: any, id:string){
    try {
        const res = await prisma.post.findUnique({
            where: {
                id,
            }, select : {
                id: true,
                title: true,
                content: true,
                authorId: true,
                imageExist: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })
        if (res) {
            return res;
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
}


// adding pagination
export async function bulkBlogs(prisma: any, authorId: string, published: boolean){
    try {
        const res = await prisma.post.findMany({
            where: {
                published,
                authorId: {
                    not: authorId
                }
            },
            select : {
                id: true,
                title: true,
                summary: true,
                content: true,
                editorState: true,
                authorId: true,
                imageExist: true,
                date: true,
                likes: true,
                numberOfComments: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })
        if (res) {
            return res;
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
}

export async function myBulkBlogs(prisma: any, authorId: string){
    try {
        const res = await prisma.post.findMany({
            where: {
                authorId
            },
            select : {
                id: true,
                title: true,
                summary: true,
                content: true,
                editorState: true,
                authorId: true,
                imageExist: true,
                date: true,
                likes: true,
                published: true,
                numberOfComments: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })
        if (res) {
            return res;
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
}

export async function likesUpdate(prisma: PrismaClient, blogId: string, likes: number) {
    try {
        const res = await prisma.post.update({
            where: {
                id: blogId
            }, data: {
                likes
            } 
        })
        if (res) {
            return res;
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
}

export async function addComment(prisma: PrismaClient, blogId: string, authorId: string, comment: string, date: string) {
    try {
        const res = await prisma.$transaction(async (prismaTx) => {
            const createComment = await prismaTx.comments.create({
                 data: {
                    blogId,
                    authorId,
                    date,
                    comment
                } 
            })

            const increaseComment = await prismaTx.post.update({
                where: {
                    id: blogId
                }, 
                data:{
                    numberOfComments: {
                        increment: 1
                    }
                }
            })
            return true
        })
        if (res) {
            return res;
        } else {
            return null;
        }
    } catch (err) {
        console.log(err)
        return null;
    }
}


export async function getComments(prisma: PrismaClient, blogId: string ) {
    try {
        const res = await prisma.comments.findMany({
            where: {
            blogId
            }, 
            select: {
                authorId: true,
                date: true,
                comment: true,
                Commentor:{
                    select: {
                        name: true
                    }
                }
            }
        })
        if (res) {
            return res;
        } else {
            return null;
        }
    } catch (err) {
        console.log(err)
        return null;
    }
}

// title               String     
//   summary             String    
//   content             String
//   editorState         String
//   imageExist          Boolean
//   published           Boolean
interface editBlog {
    title: string;
    summary: string;
    content: string;
    editorState: string;
    imageExist: boolean;
    published: boolean
}
export async function editBlog(prisma: PrismaClient, authorId: string, blogId: string, data: editBlog){
    try {
        const res = await prisma.post.update({
            where: {
            id: blogId,
            authorId,
            },
            data,
        })
        if (res) {
            return res;
        } else {
            return null;
        }
    } catch (err) {
        console.log(err)
        return null;
    }
}