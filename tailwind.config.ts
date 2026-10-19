import type { Config } from 'tailwindcss'
const config: Config = {content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],theme:{extend:{fontFamily:{sans:['var(--font-be-vietnam-pro)','Arial','sans-serif']},fontWeight:{black:'800'},colors:{accent:'#51f3bb',panel:'#171d35',muted:'#b3bbd1'}}},plugins:[]}
export default config
