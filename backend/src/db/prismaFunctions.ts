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
                aboutMe: true,
                profilePicExist: true
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

export async function getUser( prisma: PrismaClient, userId: string ) {
    try {
        const res = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                name: true,
                aboutMe: true,
                profilePicExist: true
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

interface editUserData {
    name: string;
    aboutMe: string;
    profilePicExist?: boolean
}
export async function editUser(prisma: PrismaClient, userId: string, body: editUserData){
    try {
        const res = await prisma.user.update({
            where: {
                id: userId
            },
            data: body,
            select: {
                id: true
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
            where: options,
            select: {
                id: true,
                name: true,
                email: true,
                aboutMe: true,
                profilePicExist: true
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
                aboutMe: true,
                profilePicExist: true
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





export async function getBlog(prisma: any, id:string){
    try {
        const res = await prisma.post.findUnique({
            where: {
                id,
            }, select : {
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


// adding pagination
export async function firstBulkBlogs(prisma: PrismaClient, authorId: string){
    try {
        const res = await prisma.post.findMany({
            where: {
                published: true,
                authorId: {
                    not: authorId
                }
            }, orderBy:{
                date: "desc"
            }, 
            take: 10,            
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

export async function bulkBlogs(prisma: PrismaClient, authorId: string, lastSeenBlogId: string){
    try {
        const res = await prisma.post.findMany({
            where: {
                published: true,
                authorId: {
                    not: authorId
                }
            },orderBy:{
                date: "desc"
            }, 
            skip: 1,
            take: 10,
            cursor: {
                id: lastSeenBlogId
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

export async function myFirstBulk(prisma: PrismaClient, authorId: string){
    try {
        const res = await prisma.post.findMany({
            where: {
                authorId
            }, orderBy: {
                date: "desc"
            },
            take: 10,
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


export async function myBulkBlogs(prisma: PrismaClient, authorId: string, lastSeenBlogId: string) {
    try {
        const res = await prisma.post.findMany({
            where: {
                authorId
            }, orderBy: {
                date: "desc"
            },
            skip: 1,
            take: 10,
            cursor: {
                id: lastSeenBlogId
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
        return null;
    }
}


export async function getFirstComments(prisma: PrismaClient, blogId: string ) {
    try {
        const res = await prisma.comments.findMany({
            where: {
            blogId
            }, orderBy: {
                date: "desc"
            }, 
            take: 10,
            select: {
                id: true,
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
        return null;
    }
}


export async function getNextComments(prisma: PrismaClient, blogId: string, lastSeenCommentId: number ) {
    try {
        const res = await prisma.comments.findMany({
            where: {
            blogId
            }, orderBy: {
                date: "desc"
            }, 
            skip: 1,
            take: 10,
            cursor: {
                id: lastSeenCommentId
            },
            select: {
                id: true,
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
        return null;
    }
}


interface editPost {
    title: string,
    summary: string,
    content: string,
    editorState: string,
    imageExist?: boolean,
    published: boolean,
}
export async function editBlog(prisma: PrismaClient, authorId: string, blogId: string, data: editPost){
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
        return null;
    }
}

export async function suggestions(prisma: PrismaClient, query: string) {
    try {
        const res = await prisma.post.findMany({
            where: {
                title: {
                    contains: query,
                    mode: "insensitive"
                }
            }, take: 4,
            select: {
                id: true,
                title: true
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



export async function AuthorSuggestions(prisma: PrismaClient, query: string) {
    try {
        const res = await prisma.user.findMany({
            where: {
                name: {
                    startsWith: query,
                    mode: "insensitive"
                }
            }, take: 4,
            select: {
                id: true,
                name: true,
                profilePicExist: true
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