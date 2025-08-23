export const CantFindGame = () => (
    <div className="bg-card 3xl:nth-[2]:order-first 3xl:nth-[3]:order-first 3xl:nth-[4]:order-first 4xl:nth-[2]:order-first 4xl:nth-[3]:order-first 4xl:nth-[4]:order-first 4xl:nth-[5]:order-first order-last flex flex-col items-center justify-center rounded-lg p-6 text-center md:nth-[2]:order-first lg:nth-[2]:order-first xl:nth-[2]:order-first">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Can&apos;t find a game?
        </h3>
        <p className="hidden text-sm text-gray-600 md:block dark:text-gray-400">
            Switch between different dashboard views using the tabs above, or request the game on
            Discord
        </p>
        <p className="flex flex-col items-center gap-6 pt-2 md:hidden">
            <span className="text-sm">
                Use the diamond button in the mobile menu to switch between different dashboard
                views. Still not there? Request the game on Discord.
            </span>
            <div className="flex h-11 w-11 rotate-45 transform flex-col items-center justify-center border-2 border-gray-600 bg-gray-800 hover:bg-gray-700">
                <div className="-rotate-45 transform">
                    <div className="h-5 w-5" />
                </div>
            </div>
        </p>
    </div>
);
