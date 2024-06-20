export const ToastMessage = (props: { title: string; message: string; buttons: React.ReactNode }) => {
	const { title, message, buttons } = props;

	return (
		<div className="flex justify-between w-full items-center">
			<div className="flex flex-col justify-center">
				<h1 className="font-semibold">{title}</h1>
				<p>{message}</p>
			</div>
			{buttons}
		</div>
	);
};
