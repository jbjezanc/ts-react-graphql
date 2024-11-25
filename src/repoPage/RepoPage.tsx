import { useState } from 'react';
import { SearchCriteria } from '../api/types';
import { SearchRepoForm } from './SearchRepoForm';
import { FoundRepo } from './FoundRepo';
import { StarRepoButton } from './StarButton';

import { useLazyQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_REPO } from '../api/getRepo';
import { STAR_REPO } from '../api/starRepo';

export function RepoPage() {
  const [searchCriteria, setSearchCriteria] = useState<
    SearchCriteria | undefined
  >();

  const [getRepo, { data }] = useLazyQuery(GET_REPO);

  const queryClient = useApolloClient();
  const [starRepo] = useMutation(STAR_REPO, {
    onCompleted: () => {
      queryClient.cache.writeQuery({
        query: GET_REPO,
        data: {
          repository: {
            ...data.repository,
            viewerHasStarred: true,
          },
        },
        variables: searchCriteria,
      });
    },
  });

  function handleSearch(search: SearchCriteria) {
    getRepo({
      variables: { ...search },
    });
    setSearchCriteria(search);
  }

  async function handleStartClick() {
    if (data) {
      starRepo({ variables: { repoId: data.repository.id } });
    }
  }

  return (
    <main className="max-w-xs ml-auto mr-auto">
      <SearchRepoForm onSearch={handleSearch} />
      {data && (
        <>
          <FoundRepo
            name={data.repository.name}
            description={data.repository.description}
            stars={data.repository.stargazers.totalCount}
          />

          {!data.repository.viewerHasStarred && (
            <StarRepoButton onClick={handleStartClick} />
          )}
        </>
      )}
    </main>
  );
}
