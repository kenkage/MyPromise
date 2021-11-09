class PromiseSimple {
  constructor(executionFunction) {
    this.promiseChain = [];
    this.handleError = () => {};

    this.onResolve = this.onResolve.bind(this);
    this.onReject = this.onReject.bind(this);
		console.log('executionFunction ',executionFunction);
    executionFunction(this.onResolve, this.onReject);
  }

  then(handleSuccess) {
    this.promiseChain.push(handleSuccess);
    return this;
  }

  catch(handleError) {
    this.handleError = handleError;

    return this;
  }

  onResolve(value) {
    let storedValue = value;
    try {
      this.promiseChain.forEach((nextFunction) => {
        storedValue = nextFunction(storedValue);
      });
    } catch (error) {
      this.promiseChain = [];
      this.onReject(error);
    }
  }

  onReject(error) {
    this.handleError(error);
  }
}

fakeApiCall = () => {
  const user = {
    username: 'kenkage',
    favoriteNumber: 42,
    profile: 'https://github.com/kenkage'
  };
  console.log('random ',Math.random());
  if (Math.random() > .05) {
  console.log('executing if');
    return {
      data: user,
      statusCode: 200,
    };
  } else {
  console.log('executing else');
    const error = {
      statusCode: 404,
      message: 'Could not find user',
      error: 'Not Found',
    };
    return error;
  }
};

const makeApiCall = () => {
  return new PromiseSimple((resolve, reject) => {
    setTimeout(() => {
      const apiResponse = fakeApiCall();
      if (apiResponse.statusCode >= 400) {
        reject(apiResponse);
      } else {
        resolve(apiResponse.data);
      }
    }, 5000);
  });
};

makeApiCall()
  .then((user) => {
    console.log('In the first .then()  ', user);
    return user;
  })
  .catch((error) => {
    console.log(error.message);
  });