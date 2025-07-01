import { QueryClient } from '@tanstack/react-query';



export const queryClient = new QueryClient();

// const backendURL = 'http://localhost:3000'
const backendURL = 'https://vercel-project-manager-backend.onrender.com'


//------------------------------------------------ USER

// create user 

export async function createNewAccount(loginData) {
    const response = await fetch(`${backendURL}/users`, {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
            'Content-Type': 'application/json',
        },
    });


    if (!response.ok) {
        const error = new Error('An error occurred while creating the account');
        error.code = response.status;
        error.info = await response.json();
        throw error;

        // const resErr = await response.json()
        // console.log(resErr)

    }


    if (response.status === 201) {

        const resData = await response.json();
        console.log(resData)
        const token = resData.token;
        const user = resData.user;

        localStorage.setItem('token', token);
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        localStorage.setItem('expiration', expiration.toISOString());


        return { token, user };
    }


    // return { token, user };
    // return redirect('/dashboard')
}


//  log in

export async function loginFetch(loginData) {
    const response = await fetch(`${backendURL}/users/login`, {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
            'Content-Type': 'application/json',
        },
    });


    if (!response.ok) {
        const error = new Error('An error occurred while login');
        error.code = response.status;
        error.info = await response.json();
        throw error;

        // const resErr = await response.json()
        // console.log(resErr)

    }


    if (response.status === 200) {

        const resData = await response.json();
        console.log(resData)
        const token = resData.token;
        const user = resData.user;

        localStorage.setItem('token', token);
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        localStorage.setItem('expiration', expiration.toISOString());


        return { token, user };
    }


    // return { token, user };
    // return redirect('/dashboard')
}


// logout 

export async function logout(token) {

    const response = await fetch(`${backendURL}/user/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    });

    if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');

        return
    }

    if (response.status === 401) {
        const error = new Error('Please Authenticate!!!!')
        error.code = response.status
        throw error
    }

    if (response.status === 500) {
        const error = new Error('An error occurred while loging out.');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

}


// log out all 

export async function logoutAll(token) {

    const response = await fetch(`${backendURL}/user/logoutAll`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    });

    if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');

        return
    }

    if (response.status === 401) {
        const error = new Error('Please Authenticate!!!!')
        error.code = response.status
        throw error
    }

    if (response.status === 500) {
        const error = new Error('An error occurred while loging all out.');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

}


// delete user account 

export async function fetchdeleteAccount(token) {

    const response = await fetch(`${backendURL}/users/me`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    });

    if (response.ok) {
        // localStorage.removeItem('token');
        // localStorage.removeItem('expiration');

        localStorage.clear();

        return
    }

    if (response.status === 401) {
        const error = new Error('Please Authenticate!!!!')
        error.code = response.status
        throw error
    }

    if (response.status === 500) {
        const error = new Error('An error occurred while loging all out.');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

}


// get uesr profile data 

export async function fetchUserProfile({ signal, token }) {
    let url = `${backendURL}/users/me`;

    //   const response = await fetch(url, { signal: signal });

    const response = await fetch(url, {
        method: 'GET',
        signal: signal,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });


    if (response.status === 401) {
        const error = new Error('Please Authenticate!!!!')
        error.code = response.status
        throw error
    }

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the user profile data');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const data = await response.json();

    return data;
}


// update profile 

export async function fetchUpdateProfile({ updateData, token }) {
    const response = await fetch(`${backendURL}/users/me`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    });


    if (response.status === 401) {
        const error = new Error('Please Authenticate!!!!')
        error.code = response.status
        throw error
    }

    if (!response.ok) {
        const error = new Error('An error occurred while updating profile');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const user = await response.json();

    return user;
}




//-----------------------------------------------Project


// get all project of user

export async function fetchAllProject({ signal, token }) {
    let url = `${backendURL}/projects`;

    const response = await fetch(url, {
        method: 'GET',
        signal: signal,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });


    if (response.status === 401) {
        const error = new Error('Please Authenticate!!!!')
        error.code = response.status
        throw error
    }

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the user profile data');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const data = await response.json();

    return data;
}


// Create new Project 

export async function createNewProject({ newProject, token }) {
    const response = await fetch(`${backendURL}/projects`, {
        method: 'POST',
        body: JSON.stringify(newProject),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    });

    if (response.status === 401) {
        const error = new Error('Please Authenticate!!!!')
        error.code = response.status
        throw error
    }

    if (!response.ok) {
        const error = new Error('An error occurred while creating the account');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const data = await response.json();

    return data;

}


// Detele Project 

export async function fetchdeleteProject({ id, token }) {

    const response = await fetch(`${backendURL}/projects/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    if (response.status === 401) {
        const error = new Error('Please Authenticate!!!!')
        error.code = response.status
        throw error
    }

    if (response.status === 500) {
        const error = new Error('An error occurred while delete project.');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

}


// update project name 

export async function fetchUpdateProjectName({ changeName, token, id }) {
    const response = await fetch(`${backendURL}/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(changeName),
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    });


    if (response.status === 401) {
        const error = new Error('Please Authenticate!!!!')
        error.code = response.status
        throw error
    }

    if (!response.ok) {
        const error = new Error('An error occurred while updating profile');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const data = await response.json();

    return data;
}




//------------------------------Tasks


// get all tasks for specific project

export async function fetchTasksByProject({ signal, token, projectId, completed }) {
    let url = `${backendURL}/tasks/${projectId}`;

    // Add query parameters
    const params = new URLSearchParams();
    if (completed !== undefined) {
        params.append('completed', completed);
    }

    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
        signal,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = new Error('Failed to fetch tasks');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }
    if (response.status === 401) {
        const error = new Error('Please Authenticate!!!!')
        error.code = response.status
        throw error
    }

    const data = await response.json();
    return data;
}


// create new task for specific project 

export async function createTask({ task, projectId, token }) {
    const response = await fetch(`${backendURL}/tasks/${projectId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(task),
    });

    if (!response.ok) {
        const error = new Error(
            response.status === 401
                ? 'Please Authenticate!!!!'
                : 'Failed to create task'
        );
        error.code = response.status;
        throw error;
    }


    const data = await response.json();
    return data;
}


// delete specific task from specific project

export async function fetchdeleteTask({ projectId, taskId, token, currentTask }) {

    const response = await fetch(`${backendURL}/tasks/${projectId}/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    if (response.status === 401) {
        const error = new Error('Please Authenticate!!!!')
        error.code = response.status
        throw error
    }

    if (response.status === 500) {
        const error = new Error('An error occurred while delete project.');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

}


// edit specific task from specific project 

export async function fetchUpdateTaskName({ projectId, taskId, changeName, token }) {
    const response = await fetch(`${backendURL}/tasks/${projectId}/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(changeName),
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 401) {
        const error = new Error('Please Authenticate!!!!');
        error.code = response.status;
        throw error;
    }

    if (!response.ok) {
        const error = new Error('An error occurred while updating task');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const data = await response.json();
    return data;
}





//------------------------------------------ Avatar

//get avatar

export async function fetchUserAvatar({ userId, signal }) {
    const url = `${backendURL}/users/${userId}/avatar`;

    const response = await fetch(url, {
        method: 'GET',
        signal,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.status === 401) {
        const error = new Error('Please Authenticate!');
        error.code = response.status;
        throw error;
    }

    if (!response.ok) {
        const error = new Error('Failed to fetch user avatar');
        error.code = response.status;
        error.info = await response.text(); // not JSON, because image not found
        throw error;
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob); // ⬅️ Convert binary image to browser-usable URL
}


// delete avatar 

export async function fetchdeleteAvatar({ token }) {

    const response = await fetch(`${backendURL}/users/me/avatar`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    });

    if (response.ok) {
        // ✅ Handle empty body safely
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    }

    if (response.status === 401) {
        const error = new Error('Please Authenticate!!!!')
        error.code = response.status
        throw error
    }

    if (response.status === 500) {
        const error = new Error('An error occurred while delete avatar.');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

}


// PATCH avatar 

export async function fetchUploadAvatar({ token, file }) {
    const formData = new FormData();
    formData.append('av', file); // 👈 must match backend field name: 'av'

    const response = await fetch(`${backendURL}/users/me/avatar`, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + token,
            // DO NOT set Content-Type manually for FormData
        },
        body: formData,
    });

     if (response.status === 401) {
        const error = new Error('Please Authenticate!!!!')
        error.code = response.status
        throw error
    }

    if (!response.ok) {
        const error = new Error('Failed to upload avatar');
        error.code = response.status;
        try {
            error.info = await response.json();
        } catch {
            error.info = null;
        }
        throw error;
    }

    return true; // or any flag to confirm success
}
    



