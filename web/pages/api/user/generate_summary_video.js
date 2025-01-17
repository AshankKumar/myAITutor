import {getServerSession} from "next-auth/next"
import {authOptions} from "pages/api/auth/[...nextauth]";

const generateSummaryVideo = async (req, res) => {
    const session = await getServerSession(req, res, authOptions)
    const user_id = session.user.id
    if (req.method === "POST") {
        const {key} = req.body
        await fetch(process.env.BACKEND_URL + '/summaries/videos/', {
            method: 'POST',
            body: JSON.stringify({
                key,
                user_id: user_id
            }),
            headers: {
                'X-API-Key': process.env.CB_API_SECRET,
                'Content-Type': 'application/json'
            }
        })
        return res.status(200).json({message: "generating summary"});

    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default generateSummaryVideo;
