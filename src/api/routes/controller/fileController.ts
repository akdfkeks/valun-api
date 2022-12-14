// import express, { Request, Response } from "express";
// import message from "../modules/responseMessage";
// import statusCode from "../modules/statusCode";
// import util from "../modules/util";
// import { FileService } from "../services";

// const uploadFileToS3 = async (req: Request, res: Response) => {
// 	if (!req.file)
// 		return res
// 			.status(statusCode.BAD_REQUEST)
// 			.send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));

// 	const fileData: Express.Multer.File = req.file;

// 	try {
// 		const data = await FileService.uploadFileToS3(fileData);

// 		res.status(200).json({success:true, message : "u"});
// 	} catch (error) {
// 		console.log(error);
// 		res.status(statusCode.INTERNAL_SERVER_ERROR).send(
// 			util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR)
// 		);
// 	}
// };

// export default {
// 	uploadFileToS3,
// };
