import Quiz from '#/components/Quiz';
import { env } from '#/env';
import { getData, getViteEnv } from '#/serverFunctions/serverFunctions';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ 
  // The loader pre-fetches the data before the component renders
  loader: async () => {
    const data = await getData();
    const viteEnv = await getViteEnv();
    return { data, viteEnv }
  },
  component: Home 
});

function Home() {
  const { data, viteEnv } = Route.useLoaderData();

  return (
		<main id="container-main" className="flex flex-col items-center justify-center text-black">
      <div id="container-inner" className="container flex flex-col items-center justify-center text-center max-sm:gap-1 px-4 pt-4 max-sm:pt-2 pb-4">
				<img id="logo" src="/images/fptitle.png" alt="Framework Or Pokemon?" />
				<h2 id="fop-question" className="text-2xl max-sm:text-md text-gray-200 font-bold mt-2">Is this a programming framework or a Pokemon?</h2>
			</div>
			<Quiz
				data={data}
				isLoading={false}
				isError={false}
				env={viteEnv}
			/>
			<div id="footer" className="flex flex-col items-center justify-center text-center mt-4">
				<p id="created-by-text" className="text-xl font-bold text-white">Created by Owen Wexler</p>
			</div>
		</main>
  )
}
