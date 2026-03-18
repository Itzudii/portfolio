import requests as req
import json

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

    data = []

    repos = get('https://api.github.com/users/Itzudii/repos')

    for repo in repos:
        data.append(get_info_proj(repo))

    with open('project.json','w') as f:
        f.write(json.dumps(data))

    print('successfully phase 1 compleete')
    print('select 6 projects before phase 2')