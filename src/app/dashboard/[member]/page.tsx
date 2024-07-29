export default async function Page({ params }: { params: { member: string } }) {
    const member = params.member;
    return (
        <main>
            {member}
        </main>
    );
}