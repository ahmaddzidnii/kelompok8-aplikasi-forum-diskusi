interface ThreadsDetailProps {
  params: {
    threadsSlug: string;
  };
}

const ThreadsDetail = ({ params }: ThreadsDetailProps) => {
  return <div>{JSON.stringify(params)}</div>;
};

export default ThreadsDetail;
