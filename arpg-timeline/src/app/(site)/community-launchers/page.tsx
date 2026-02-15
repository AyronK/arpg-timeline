import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Community game launchers – aRPG Timeline",
    description:
        "Disclaimer about community-run game servers and custom launchers linked from aRPG Timeline. Use at your own risk.",
};

const CommunityLaunchersPage = () => {
    return (
        <div className="relative container mx-auto mb-8">
            <section className="container flex flex-col gap-4 md:my-16">
                <div className="mx-auto mt-8 max-w-prose">
                    <h1 className="mb-8 hidden text-3xl md:block">Community game launchers</h1>
                    <span className="mb-4 block text-3xl md:hidden">Community game launchers</span>
                    <div className="ml-2 flex flex-col gap-4 text-base leading-relaxed md:gap-6">
                        <p>
                            This site lists some <strong>community-run</strong> games and custom
                            launchers alongside official titles. These are not published or operated
                            by aRPG Timeline or by the original game studios.
                        </p>
                        <p>
                            <strong>We do not endorse, operate, or guarantee</strong> any
                            community-run game, server, or launcher. Links to external sites are
                            provided for information only. You use them at your own risk.
                        </p>
                        <p>
                            Community launchers and private servers are often unverified by stores
                            or antivirus vendors. Downloads may be{" "}
                            <strong>flagged or blocked</strong> by security software. Some projects
                            may require you to add exceptions or disable protections. We cannot
                            vouch for their safety, security, or legality.
                        </p>
                        <p>
                            By following any external link to a community game or launcher, you
                            accept that aRPG Timeline is not responsible for any harm, loss, or
                            damage that may result from visiting third-party sites or using their
                            software or services.
                        </p>
                        <p>
                            We support the effort of community-driven projects and list them so you
                            can discover them. Please do your own research and take appropriate
                            precautions before downloading or installing anything from external
                            sources.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CommunityLaunchersPage;

export const revalidate = false;
