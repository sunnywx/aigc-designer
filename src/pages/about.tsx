import { useEffect } from "react";

interface Props {
  user: {
    name: string
  }
}

export default function About(props: Props) {
  
  useEffect(()=> {
    console.log("props: ", props);
  }, [])
  
  return (
    <div>about me: {props.user.name}</div>
  )
}

export const getServerSideProps=async ()=> {
// export const getStaticProps=async ()=> {
  const resp=await fetch('https://api.github.com/users/sunnywx');
  const user=await resp.json();
  
  return {
    props: {
      user
    }
  }
}