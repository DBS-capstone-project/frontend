const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

module.exports = {
  // Entry point untuk JavaScript dan CSS
  entry: {
    index: "./src/scripts/pages/index.js",
    emailConfirmation: "./src/scripts/pages/emailConfirmation.js",
    signup: "./src/scripts/pages/signup.js",
    login: "./src/scripts/pages/login.js",
    profile: "./src/scripts/pages/profile.js",
    landingMood: "./src/scripts/pages/landingMood.js",
    landingReflection: "./src/scripts/pages/landingReflection.js",
    finishMood: "./src/scripts/pages/finishMood.js",
    finishReflection: "./src/scripts/pages/finishReflection.js",
    chatAI: "./src/scripts/pages/chatAI.js",
    detailMood: "./src/scripts/pages/detailMood.js",
    reflection: "./src/scripts/pages/reflection.js",
    formMood: "./src/scripts/pages/formMood.js",
    styles: "./src/styles/input.css", // Entry point untuk Tailwind CSS
  },
  output: {
    filename: "[name].bundle.js", // Nama file JavaScript hasil build
    path: path.resolve(__dirname, "dist"), // Folder output
    clean: true, // Membersihkan folder dist sebelum build
    publicPath: "/", // URL dasar untuk aset statis
  },
  module: {
    rules: [
      {
        test: /\.html$/, // Proses file HTML
        use: ["html-loader"],
      },
      {
        test: /\.css$/, // Proses file CSS
        use: [
          MiniCssExtractPlugin.loader, // Ekstrak CSS ke file terpisah
          "css-loader", // Baca CSS sebagai modul
          {
            loader: "postcss-loader", // Gunakan PostCSS untuk Tailwind CSS
            options: {
              postcssOptions: {
                plugins: [
                  require("tailwindcss"), // Gunakan Tailwind CSS
                  require("autoprefixer"), // Tambahkan prefix otomatis
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // Proses file gambar
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    ...[
      "index.html",
      "emailConfirmation.html",
      "login.html",
      "profile.html",
      "landingMood.html",
      "landingReflection.html",
      "signup.html",
      "detailMood.html",
      "formMood.html",
      "finishMood.html",
      "formReflection.html",
      "adults.html",
      "kids.html",
      "teens.html",
      "finishReflection.html",
      "chatAI.html",
      "privacyPolicy.html",
      "termsConditions.html",
    ].map((page) => {
      const templatePath = `./src/public/pages/${page}`; // Path template HTML
      const pageName = page.split(".")[0]; // Nama halaman tanpa ekstensi
      let chunks = [];
    
      // Tentukan chunks berdasarkan nama halaman
      if (["adults", "teens", "kids"].includes(pageName)) {
        chunks = ["reflection", "styles"]; // Gunakan reflection.bundle.js
      } else {
        chunks = [pageName, "styles"]; // Gunakan entry point sesuai nama halaman
      }
    
      return new HtmlWebpackPlugin({
        template: templatePath, // Template HTML asli
        filename: page, // Nama file yang dihasilkan di dist/
        chunks: chunks.filter(
          (chunk) =>
            chunk !== "formReflection" &&
            chunk !== "privacyPolicy" &&
            chunk !== "formReflection" &&
            chunk !== "termsConditions"
        ), // Filter chunks yang tidak diperlukan
        inject: true, // Inject CSS dan JS ke dalam HTML
        scriptLoading: "defer", // Pastikan JS dimuat setelah HTML
        meta: {
          viewport: "width=device-width, initial-scale=1.0", // Meta tag viewport
        },
      });
    }),
  
    // Plugin untuk ekstraksi CSS dan output ke file
    new MiniCssExtractPlugin({
      filename: "output.css",  // Ekstrak hasil Tailwind ke output.css
    }),
  
    // Plugin untuk menyalin main.css ke folder dist
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/styles/main.css"),
          to: "main.css",
        },
      ],
    }),

    new HtmlWebpackTagsPlugin({
      tags: ['main.css'],
      append: false, // Masukkan di <head>
    }),
  ],
  devServer: {
    static: "./dist", // Folder statis untuk server pengembangan
    port: 8080, // Port server pengembangan
    open: true, // Buka browser secara otomatis
  },
  mode: "development", // Mode pengembangan
};