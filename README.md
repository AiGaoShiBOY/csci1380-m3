# M3: Node Groups & Gossip Protocols
> Full name: `<first last>`
> Email:  `<email@brown.edu>`
> Username:  `cslogin`

## Summary
> Summarize your implementation, including key challenges you encountered

My implementation comprises `7` new software components, totaling `400` added lines of code over the previous implementation. Key challenges included:
> 1. How to implement `stop` and `spawn` properly. I solved it by reading the offical documents of child_process, discussing with TAs frequently, and checking the hints on Ed.
> 2. How to initialize the service properly. It tooks me a long time to understand how to initialize the distribution service for one specified group. I think the saying  `all` is also a distribution service is really misleading, because the all the scripts under `all` are more like templates, rather than a specific "all service".
> 3. How to debug locally. My code can always pass the tests on gradescope. However, I find it so hard to debug locally since every time I ran the test, the results were different. I spent a long time solving this but it did not work out at last. I think the reason might be the child_process cannot succesfully launch everytime, but I could not find the reason whether by adding event listener nor adding try_catch. This really caused huge trouble for my debugging and made the whole process time-consuming. I have posted the detail of the issue on Ed: https://edstem.org/us/courses/55098/discussion/4449808.


## Correctness & Performance Characterization
> Describe how you characterized the correctness and performance of your implementation

*Correctness*: I wrote `5` tests; these tests take `0.714` to execute. 

*Performance*: I did not write the performance test since I haven't completed the gossip part.

## Key Feature
> What is the point of having a gossip protocol? Why doesn't a node just send the message to _all_ other nodes in its group?

> 1. It can reduce the network load, release congestion and improve the performance.
> 2. It is more efficient, since information can be exchanged concurrently through multiple nodes until it is delivered to the entire network, which is much more efficient than one node exchanging information to all other nodes.
> 3. It has fault-tolerance ability: In the context of node failures or network problems, the gossip protocol ensures that information can eventually reach all nodes. Even if some nodes are temporarily unable to receive the information, through the information delivery of other paths, these nodes will eventually be able to access the complete information.
> 4. It can improve the scalability: In gossip protocal, even in a system with a very large number of nodes, each node only needs to handle a limited amount of traffic, thus improving the scalability.


## Time to Complete
> Roughly, how many hours did this milestone take you to complete?

Hours: `80h`

