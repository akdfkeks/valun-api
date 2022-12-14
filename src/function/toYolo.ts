import axios from "axios";
import { sortResultByBboxWithConf, tempData } from "./detectionResultParser";
import prisma from "../config/prisma";
import { Result } from "../interface/Detection";
import path from "path";
import { categoryClassifier } from "./categoryClassifier";

export async function toYolo(fileName: string, issueId: number, imageId: number, src: string) {
	const YOLO_ADDRESS = "221.148.26.122:3000";

	try {
		const detectionResult = await axios
			.post(
				`http://${YOLO_ADDRESS}/detect`,
				{
					fileName,
					src,
				},
				{ timeout: 10000 }
			)
			.catch((error) => {
				if (error.code === "ECONNABORTED") return null;
			});
		//------------forDev------------------
		// const detectionResult = {
		// 	data: tempData,
		// };
		console.log(detectionResult.data);

		if (detectionResult.data.length > 0) {
			const sortResult = sortResultByBboxWithConf(detectionResult.data);

			const updateResult = await Promise.all([
				await prisma.issue_image.update({
					where: { id: imageId },
					data: {
						detected_object: {
							createMany: {
								data: (function () {
									const list = sortResult.map((data: Result) => {
										return {
											// class id 는 1부터 시작함
											class_id: data.code,
											confidence: data.conf,
											bounding_size: data.size,
										};
									});

									return list;
								})(),
							},
						},
					},
				}),
				await prisma.issue.update({
					where: { id: issueId },
					data: {
						active: true,
						class: categoryClassifier(sortResult[0].code),
					},
				}),
			]);
			const updateBroomResult = await prisma.user.update({
				where: { id: updateResult[1].user_id },
				data: { broom: { increment: 500 } },
			});
		} else {
			const updateResult = await Promise.all([
				await prisma.issue.update({
					where: { id: issueId },
					data: {
						active: true,
						class: 100,
					},
				}),
			]);
		}
	} catch (err) {
		console.log(err);
		throw err;
	}
}
