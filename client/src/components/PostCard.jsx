import React from 'react'
import Card from './Card';

const PostCard = (props) => {

    console.log('post card', props);

    if (!props.list) return null;

    return (
        <div className="w-full min-h-50 mt-4 p-1 flex gap-3 flex-wrap justify-center lg:justify-center">

            {
                props.list.map((ele) => {

                    return (
                        <Card
                            key={ele._id}
                            ele={ele}
                        />
                    );

                })
            }

        </div>
    )
}

export default PostCard