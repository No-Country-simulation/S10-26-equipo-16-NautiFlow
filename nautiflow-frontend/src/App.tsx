import Footer from "./components/Footer";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="flex min-h-dvh flex-col bg-base-200/30">
      <Navbar />

      <main className="flex-1 pt-16 flex flex-col">
        <Layout />
      </main>

      <Footer />
    </div>
  );
}

export default App;
