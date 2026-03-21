import requests as req

TREE_PATH = 'json/tree.json'
DB_PATH = 'update/db.json'
PROJ_PATH = 'json/project.json'
PROJECT_LIMIT = 6

def get(url:str):
    response = req.get(url)
    return response.json()

def get_info_proj(repo):    
    return {
        "name": repo["name"],
        "full_name": repo["full_name"],
        "private": repo["private"],
        "avatar_url": repo["owner"]["avatar_url"],
        "html_url": repo["html_url"],
        "description": repo["description"],
        "created_at": repo["created_at"],
        "updated_at": repo["updated_at"],
        "pushed_at": repo["pushed_at"],
        "git_url": repo["git_url"],
        "ssh_url": repo["ssh_url"],
        "homepage": repo["homepage"],
        "size": repo["size"],
        "stargazers_count": repo["stargazers_count"],
        "watchers_count": repo["watchers_count"],
        "language": repo["language"],
        "forks_count": repo["forks_count"],
        "topics": repo["topics"],
        "forks": repo["forks"],
        "watchers": repo["watchers"],
        "selected":False
    }

if __name__ == '__main__':
    import db
    import warnings

    data = []

    repos = get('https://api.github.com/users/Itzudii/repos')

    for repo in repos:
        data.append(get_info_proj(repo))

    data = [dat for dat in data if 'featured' in dat['topics']]

    names = [dict['name'] for dict in data]

    db.write_data({"names":names},DB_PATH)
    db.write_data(data,PROJ_PATH)

    if len(data) > PROJECT_LIMIT:
        warnings.warn('warning: you selected projects more than 6, too many projects remove featured tag from github')

    print('successfully phase 1 complete')
