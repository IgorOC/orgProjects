import Link from "next/link";
import Image from "next/image";
import projectImg from "../public/scott-graham-5fNmWej4tAA-unsplash.jpg";
import travelImg from "../public/tom-barrett-M0AWNxnLaMw-unsplash.jpg";
import { FaProjectDiagram, FaPlaneDeparture } from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white">
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg">
        <nav className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-3xl font-extrabold tracking-wide animate-pulse">
            OrgProjects
          </h1>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="bg-white text-blue-600 px-5 py-2 rounded-full shadow hover:bg-blue-600 hover:text-white transition-transform transform hover:scale-105 duration-300"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-blue-600 px-5 py-2 rounded-full shadow hover:bg-blue-800 transition-transform transform hover:scale-105 duration-300"
            >
              Registrar
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative text-center py-32 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 1200 120"
            className="absolute bottom-0 fill-blue-700 opacity-40"
            preserveAspectRatio="none"
          >
            <path
              d="M0,96L48,80C96,64,192,32,288,37.3C384,43,480,85,576,117.3C672,149,768,171,864,149.3C960,128,1056,64,1152,64L1200,64L1200,0L1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>
        <h2 className="text-6xl font-extrabold mb-6 relative z-10">
          Organize Seus Projetos e Viagens
        </h2>
        <p className="text-lg text-gray-300 mb-8 relative z-10">
          Transforme suas ideias em realidade com modernidade e simplicidade.
        </p>
        <Link
          href="/auth/register"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-110 transition duration-300 relative z-10"
        >
          Comece Agora
        </Link>
      </section>

      {/* Funcionalidades com Imagens */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <h3 className="text-4xl font-bold text-center mb-16 text-gray-200">
          O que Você Pode Fazer
        </h3>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="group relative overflow-hidden rounded-lg shadow-xl">
            <Image
              src={projectImg}
              alt="Gerenciamento de Projetos"
              className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 p-6 text-white">
              <FaProjectDiagram className="text-3xl mb-4 animate-bounce" />
              <h4 className="text-2xl font-bold mb-2">Gerenciamento de Projetos</h4>
              <p className="text-gray-300">
                Organize suas tarefas e metas com uma interface elegante e funcional.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg shadow-xl">
            <Image
              src={travelImg}
              alt="Gestão de Viagens"
              className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 p-6 text-white">
              <FaPlaneDeparture className="text-3xl mb-4 animate-bounce" />
              <h4 className="text-2xl font-bold mb-2">Gestão de Viagens</h4>
              <p className="text-gray-300">
                Planeje roteiros incríveis e aproveite sua viagem ao máximo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="bg-gray-800 py-20">
        <h3 className="text-4xl font-bold text-center mb-12 text-gray-200">
          Depoimentos
        </h3>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <p className="italic text-gray-300">
              "Organizar meus projetos nunca foi tão fácil. A plataforma é intuitiva e eficiente."
            </p>
            <span className="block mt-4 font-bold text-blue-400">- João Silva</span>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <p className="italic text-gray-300">
              "Graças à plataforma, consegui planejar viagens incríveis com todos os detalhes."
            </p>
            <span className="block mt-4 font-bold text-blue-400">- Maria Oliveira</span>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 OrgProjects. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
