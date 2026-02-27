import HeroSectionDefault from '../components/home/HeroSectionDefault'
import SectionCard from '../components/home/SectionCard'
import { useSelector } from 'react-redux';

export default function Home() {
  const mobileOpen = useSelector(state => state.theme.isMobileOpen);
  return (
    <div className={`flex flex-col ${mobileOpen && 'hidden'} pt-16`}>
      <HeroSectionDefault />
      {
        [
        {
          Option:'Payment Options',
          title:'Multiple Payment Options'
        },
        {
          Option:'',
          title:'Why Book with BusSeat?'
        },
        ].map((info, index) => {
          return(
            <SectionCard 
            Option={info.Option}
            title={info.title}
            key={`${index}`}
          />
          )
        })
      }
    </div>
  )
}