import { FaDiscord, FaEnvelope, FaReddit } from "react-icons/fa";

export default function ContactForm() {
	return (
		<div className="flex flex-col justify-center items-center p-5 gap-20 h-[70vh]">
			<div>
				<h1 className="text-2xl font-semibold">Feedback</h1>
				<p className="text-lg">I'd love to hear from you. You can contact me on any of the following platforms:</p>
			</div>
			<div>
				<a
					className="btn btn-ghost btn-wide text-xl"
					target="_blank"
					rel="noreferrer"
					href="https://docs.google.com/forms/d/e/1FAIpQLSfKjXTfGT-V301HBSBo-3lXc5UCGGKbq9TfJWEbwLJBePcGoA/viewform?usp=sf_link">
					Leave Feedback
				</a>
			</div>
			<div className="flex gap-10 sm:gap-20">
				<a className="" href="https://discord.com/users/162738736042475520" target="_blank" rel="noreferrer">
					<FaDiscord size={50} />
				</a>

				<a className="" href="https://www.reddit.com/user/Interesting-Edge9890" target="_blank" rel="noreferrer">
					<FaReddit size={50} />
				</a>

				<a className="" href="mailto:erbgfeedback@gmail.com" target="_blank" rel="noreferrer">
					<FaEnvelope size={50} />
				</a>
			</div>
		</div>
	);
}
