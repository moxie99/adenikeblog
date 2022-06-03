//how to store type definitions in
export interface Post {
    _id: string;
    _createdAt: string;
    title: string;
    author:{
        name: string;
        image:string;
    },
    comments: Comment[];
    description: string;
    mainImage:{
        asset:{
            url:string;
        };
    };
    slug:{
        current:string;
    };
    body: [object];
    }

    export interface Comment{
        comment: string,
        approved:boolean;
        name: string;
        email: string;
        post:{
            _ref:string;
            _type:string;
        };
        _createdAt: string;
        _id: string;
        _rev:string;
        _type:string;
        _updatedAt: string;
    }