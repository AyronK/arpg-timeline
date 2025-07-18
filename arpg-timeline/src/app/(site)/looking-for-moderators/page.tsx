import Link from "next/link";

const LookingForModeratorsPage = () => {
    return (
        <div className="container mx-auto mb-20 min-h-[60vh] max-w-prose px-4">
            <h2 className="mt-12 mb-6 pt-2 pb-4 text-center text-2xl font-semibold">
                Looking for Moderators
            </h2>
            <p className="mb-4">Join our team of moderators and help us build the aRPG Timeline!</p>
            <p className="mb-4">
                As a moderator, you&apos;ll play a crucial role in keeping the website up to date.
                If you stay informed about your favorite games and want to help build this
                community, please{" "}
                <Link
                    className="font-semibold hover:opacity-75"
                    href={process.env.DISCORD_URL!}
                    rel="noopener noreferrer"
                >
                    contact us on Discord
                </Link>{" "}
                or{" "}
                <Link
                    className="font-semibold hover:opacity-75"
                    href={`mailto:${process.env.CONTACT_EMAIL!}`}
                    rel="noopener noreferrer"
                >
                    send an email
                </Link>
                .
            </p>
            <p className="mb-4">
                <span className="font-semibold">Why we need you:</span>
            </p>
            <ul className="mb-4 ml-4 list-inside list-disc">
                <li>Help verify season launch and end dates based on automatic notifications.</li>
                <li>Contribute to website content.</li>
                <li>Suggest new features.</li>
                <li>Assist in further automating processes.</li>
            </ul>
            <p className="mb-4">
                While we strive to automate as much as possible, the human crosscheck is essential
                for maintaining the website&apos;s reliability.
            </p>
        </div>
    );
};

export default LookingForModeratorsPage;
