

export default function date(date: string) {
    const now = new Date();
    const blogDate = new Date(date)

    if ( blogDate.getFullYear() < now.getFullYear() ){
        return `${blogDate.toLocaleString('default', { month: 'short' })} ${blogDate.getDate()}, ${blogDate.getFullYear()}`
    } else {
        if( blogDate.getMonth()+blogDate.getDate() == now.getMonth()+now.getDate()){
                return "Today"
        }
        else {
            return `${blogDate.toLocaleString('default', { month: 'short' })} ${blogDate.getDate()}`
        }
    }
}