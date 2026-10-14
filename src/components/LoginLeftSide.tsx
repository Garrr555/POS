const LoginLeftSide = () => {
  return (
    <div className="hidden md:flex w-1/2 bg-orange-950 relative border-r overflow-hidden border-slate-200">
      <div className="absolute -top-30 -left-30 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl"></div>
      <div className="relative z-10 flex flex-col items-start justify-center p-12 lg:p-20 w-full h-full">
        <h1 className="text-4xl lg:text-5xl font-medium text-white mb-6 leading-tight tracking-tight">
          <p className="text-orange-500 uppercase text-6xl">Point Of Selling</p>{" "}
          System
        </h1>
        <p className="text-slate-400 text-lg max-w-md leading-relaxed">
          A Point of Sale (POS) system is a software application that allows businesses to process sales transactions, manage inventory, and track customer data.
        </p>
      </div>
    </div>
  );
};

export default LoginLeftSide;
