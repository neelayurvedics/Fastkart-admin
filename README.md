# Fastkart Admin Panel

A modern, powerful admin panel for managing your Fastkart e-commerce platform. Built with Next.js 15, React, and integrated with Laravel backend.

## 🚀 Quick Links

- **Deploy to Production**: See [`deployment/QUICK_START.md`](./deployment/QUICK_START.md) for 5-minute deployment
- **Complete Deployment Guide**: See [`deployment/README.md`](./deployment/README.md)
- **Backend Setup**: See [`deployment/LARAVEL_BACKEND_CONFIG.md`](./deployment/LARAVEL_BACKEND_CONFIG.md)
- **API Connection**: See [`deployment/FRONTEND_BACKEND_CONNECTION.md`](./deployment/FRONTEND_BACKEND_CONNECTION.md)

## 📋 Features

- 🛍️ **Product Management** - Full CRUD operations for products
- 📦 **Order Management** - Track and manage customer orders
- 👥 **User Management** - Manage customers and admin users
- 🎨 **Media Library** - Upload and manage images and files
- 📊 **Dashboard** - Analytics and insights
- 🔐 **Secure Authentication** - Laravel Sanctum integration
- 🌍 **Multi-language Support** - Built-in i18n
- 📱 **Responsive Design** - Works on all devices

## 🛠️ Technology Stack

- **Framework**: Next.js 15.5.6
- **UI Library**: React 18
- **Styling**: Bootstrap 5, Reactstrap
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Authentication**: Laravel Sanctum (Backend)
- **Deployment**: Vercel

## 🏃 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js GitHub repository](https://github.com/vercel/next.js/)

### Project Resources

- [Deployment Guide](./deployment/README.md) - Complete Vercel deployment instructions
- [Backend Configuration](./deployment/LARAVEL_BACKEND_CONFIG.md) - Laravel setup guide
- [API Connection Guide](./deployment/FRONTEND_BACKEND_CONNECTION.md) - How frontend connects to backend
- [Architecture Diagram](./deployment/ARCHITECTURE.md) - System architecture overview

## 📦 Deployment

### Quick Deployment (5 minutes)

```bash
# 1. Push to GitHub
git push origin main

# 2. Deploy to Vercel
# Visit vercel.com and import your repository

# 3. Add environment variables (see deployment/vercel-environment-variables.env)

# 4. Configure backend
ssh your-server
cd /path/to/laravel
php artisan storage:link
php artisan config:clear
```

For detailed instructions, see [`deployment/QUICK_START.md`](./deployment/QUICK_START.md)

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```bash
# API Configuration
URL=https://api.neelayurvedics.in/api/admin
storageURL=https://api.neelayurvedics.in
adminURL=https://api.neelayurvedics.in/admin/

# Client-side Variables
NEXT_PUBLIC_STORAGE_URL=https://api.neelayurvedics.in
NEXT_PUBLIC_ADMIN_URL=https://api.neelayurvedics.in/admin/
NEXT_PUBLIC_API_URL=https://api.neelayurvedics.in/api/admin

# Environment
NODE_ENV=development
```

See `.env.local.example` for more details.

## 🐛 Troubleshooting

### Common Issues

**Build Fails**
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript/ESLint errors
- Verify Node.js version is compatible (v18+)

**Can't Login**
- Check if backend API is running
- Verify environment variables are set correctly
- Check CORS configuration on backend

**Images Don't Load**
- Backend needs `php artisan storage:link`
- Check `BACKEND_STORAGE_SETUP_REQUIRED.md` for details

For more troubleshooting, see [`deployment/README.md`](./deployment/README.md#-troubleshooting)

## 📚 Project Structure

```
fastkart-admin/
├── deployment/          # Deployment guides and configuration
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   ├── data/           # Static data and configurations
│   ├── elements/       # Reusable UI elements
│   ├── helper/         # Context providers
│   ├── layout/         # Layout components
│   └── utils/          # Utility functions
├── .env.local.example  # Environment variables example
├── next.config.js      # Next.js configuration
└── package.json        # Dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

- **Documentation**: Check the `deployment/` folder
- **Issues**: Create an issue in the repository
- **Backend Team**: Contact for API-related issues

---

**Built with ❤️ for Neel Ayurvedics**

**Last Updated**: November 1, 2025

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


    <h4 className='fw-semibold'>{t("product_box_variant")}</h4>
              <Row className=' row-cols-xxl-5 row-cols-xl-3 row-cols-lg-2 row-cols-md-3 row-cols-2 g-4'>
                    {Product_box_variant.map((elem, i) => (
                        <div key={i} >
                            <div className="selection-box text-center">
                            <Input name="[options][product][product_box_variant]" type="radio" id={elem.value} checked={values["options"]["product"]["product_box_variant"] == elem.value ? true : false} onChange={() => handleChange(elem)}/>
                                <Label htmlFor={elem.value}>
                                    <div>
                                        <Image src={elem.image} className="img-fluid" alt="" height={100} width={165} />
                                    </div>
                                    <h4 className="mt-2">{t(elem.label)}</h4>
                                </Label>
                            </div>
                        </div>
                    ))}
                </Row>