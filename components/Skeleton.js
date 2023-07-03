import { Skeleton } from '@rneui/themed';

const AppSkeleton = (props) => (
    <Skeleton style={{ borderRadius: 8 }} {...props} animation='wave'/>
)

export default AppSkeleton;
