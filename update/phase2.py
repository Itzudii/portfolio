import requests as req
from itertools import count
import warnings

import db

count = count()

from phase1 import PROJ_PATH,DB_PATH,TREE_PATH


def get(url:str):
    response = req.get(url)
    if response.status_code == 403:
        raise RuntimeError("limit extend")
    return response.json()

def get_main_branch_sha(branches):
    sha = [branch['commit']['sha'] for branch in branches if branch['name'] == 'main']
    return sha

def get_branch_names(branches):
    return [branch['name'] for branch in branches]

def genrate_tree(paths):
    tree = {}

    for path in paths:
        parts = path.split('/')
        current = tree

        for i, part in enumerate(parts):

            # if key exists but is None, convert to dict
            if part in current and current[part] is None:
                current[part] = {}

            if i == len(parts) - 1:
                current.setdefault(part, None)
            else:
                current = current.setdefault(part, {})
    return tree

def get_tree(repo_name,sha):
    tree = get(f'https://api.github.com/repos/Itzudii/{repo_name}/git/trees/{sha}?recursive=1')
    paths = [dic['path'] for dic in tree['tree']]
    return genrate_tree(paths)

def commits_of_branch(repo_name,branch_name):
    commits = get(f'https://api.github.com/repos/Itzudii/{repo_name}/commits?sha={branch_name}')
    return [{
        'sha':commit['sha'],
        'date':commit['commit']['author']['date'],
        'message':commit['commit']['message']
    } for commit in commits]

def one_repo(repo_name):
    language = get(f'https://api.github.com/repos/Itzudii/{repo_name}/languages')

    branches = get(f'https://api.github.com/repos/Itzudii/{repo_name}/branches')

    main_sha = get_main_branch_sha(branches)

    tree = get_tree(repo_name,main_sha[0])

    commits = {}
    names = get_branch_names(branches)
    for name in names:
        commits[name] = commits_of_branch(repo_name,name)
        
    return {
        'language':language,
        'tree':tree,
        'commits':commits
    }
        
def start_collecting(names):

    final = {}
    nc_names = []

    for index,name in enumerate(names):
        try:
            final[name]=one_repo(name)
        except Exception as e:
            print(e)
            nc_names = names[index:]
            break
    
    return final,nc_names

if __name__ == '__main__':
    promt = '''
Enter Value
full start:1
contine start:0
'''
    fullstart = int(input(promt))

    tree = db.read_data(TREE_PATH)
    dbData = db.read_data(DB_PATH)
    projects = db.read_data(PROJ_PATH)

    if fullstart:
        names = [dict['name'] for dict in projects]
        db.write_data({"names":names},DB_PATH)
    else:
        names = dbData['names']

    final,nc_names = start_collecting(names)

    for name,value in final.items():
            tree[name] = value

    db.write_data(final,TREE_PATH)
    db.write_data({"names":nc_names},DB_PATH)
    if nc_names:
        warnings.warn('run again after 1hour to complete phase')
    else:
        print("complete phase2 successfully")
