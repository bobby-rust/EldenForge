/**
 * ToastMessage component.
 *
 * This component displays a toast message with a title, message and optional buttons.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the toast message.
 * @param {string} props.message - The message of the toast message.
 * @param {React.ReactNode} props.buttons - The buttons to be displayed.
 * @return {JSX.Element} The rendered ToastMessage component.
 */
export const ToastMessage = (props: { title: string; message: string; buttons: React.ReactNode }) => {
	const { title, message, buttons } = props;

	return (
		// The toast message container.
		<div className="flex justify-between w-full items-center">
			<div className="flex flex-col justify-center">
				{/* The title of the toast message. */}
				<h1 className="font-semibold">{title}</h1>
				{/* The message of the toast. */}
				<p>{message}</p>
			</div>
			{/* The buttons to be displayed. */}
			{buttons}
		</div>
	);
};
