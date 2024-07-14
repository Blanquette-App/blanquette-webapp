import type { Metadata } from "next";
import styles from './layout.module.scss';
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Blanquette"
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body className={inter.className}>
                <main className={styles.main}>
                    <div className={styles.description}>
                        <span>Comment est votre blanquette ?</span>
                        <Image src="/blanquette-icon.png" alt="Blanquette app's icon" width={85} height={85} />
                    </div>
                    {children}
                </main>
            </body>
        </html>
    );
}
