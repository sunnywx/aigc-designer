import cs from 'classnames'
import {CategoryItem} from './types'

import styles from './index.module.scss'

interface Props extends CategoryItem{
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

export default function Category({type, name, icon, className, active, onClick}: Props) {
  return (
    <div
      className={cs(styles.group, {
        [styles.active]: active,
      }, className)}
      onClick={onClick}
    >
      {icon}
      <p className='text-gray-600 text-10'>{name}</p>
    </div>
  );
}
