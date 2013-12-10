---
layout: post
title: "Understanding Cache in Terms of Hash Table"
category: technium
tags: []
---

Cache is the hardware implemention of a [map](http://en.wikipedia.org/wiki/Associative_array)(a cache can be regarded as a subset of the main memory)  when hash table is the software implementation of it.

By thinking caches as software hash tables, many concepts about cache can be illustrated in the context of data structure manipulation(in high level languages) instead of  the context of signal-level operations. 


### Preliminaries

If we consider memory as a large vector(i.e. `Memory[N]`), then a cache is an unordered [map](http://en.wikipedia.org/wiki/Associative_array), which is a collection of `(key, value)` pairs, where `key` is the memory location from 1 to N and `value` is the content of `Memory[key]`. More importantly, each possible `key` appears at most once in the collection. Because one memory location at most has one mirror in the cache. 

	Cache = {(i, Memory[i]) | 1<=i<=N  }

A software version of cache without any limitations can be implemented as [seperate chaining hash table](http://en.wikipedia.org/wiki/Hash_table#Separate_chaining):

	[Bucket] (id1, x1) -> (id2, x2)
	[0] (8, x)
	[1] (17, x) -> (57, x)
	[2] (2, x) -> (10, x) -> (34, x)
	[3] (19, x) -> (11, x) -> (59, x) -> (3, x)
	[4] (36, x) -> (4, x)
	[5] (5, x)
	[6]  
	[7] (47. x)

Here we use `f(x) = x % 8` as the hash function. That is, memory location `i` is hashed into the bucket with id  `i%8`. The collision problem is resolved through chaining.


### Cache Reference/Hit/Miss

Given a memory location `i`, a **reference** to the cache is analogous to the process of searching a certain entry in the hash table, which consists of two steps:

*  Calculate the bucket id from the memory location `i`
*  Search alongside the chain, comparing each entry’s key with `i`

If any key is matched, then the CPU knows the desired memory location has already been hashed. So CPU directly operates on the `value` field instead of accessing the main memory. This condition is always known as **cache hit**.

	def accessMemory(i, op):
	    if Cache.has_key(i):
		    cache_hit = 1
		 if cache_hit:
		    content = Cache.get(i)
		    return content.op()

A **cache miss** happens when the CPU fails to find such match. That means the target memory location has not yet been hashed. As a result, CPU fetches the data from remote memory, and inserts it into its bucket before operating on them.

	def accessMemory(i, op):
	    if Cache.has_key(i):
		    cache_hit = 1
		 else
		 	 cache_miss = 1
         ...
         if cache_miss:
         	content = Memory[i]
            cache.insert(i, content)
            return content.op()

### Sets

Two observations can be derived from the picture of our hash table:

* The more buckets a cache has, the less likely it is that collision<span class="sidenote">The term "collision" is inherited from the hash table. The hardware people call this condition "conflict" </span> will occur. In an extreme case, if the number of buckets is equal to  `N`, collision is eliminated entirely. 
* The average time to look up a certain memory location in cache is related to the average size of the chains. Finding the bucket requires only `O(1)` time, while searching for the desired key alongside the chain is time-consuming because it is sequential.

The **buckets** are also known as **sets** in cache terminology.


### Ways

At hardware level, it is non-trivial to implement data structures like linked-lists. 
The alternative way is to sparsely organize the entries within one bucket as a fixed-length array.

	[Bucket] entry 1 | entry 2 | entry 3 | entry 4
	[0]  (8, x) |    -    |    -    |   -
	[1] (17, x) | (57, x) |    -    |   -
	[2]  (2, x) | (10, x) | (34, x) |   -
	[3] (19, x) | (11, x) | (59, x) | (3, x)
	[4] (36, x) |  (4, x) |    -    |   -
	[5]  (5, x) |    -    |    -    |   -  
	[6]     -   |    -    |    -    |   -  
	[7] (47, x) |    -    |    -    |   -  

The entries within one bucket is called **ways**. The cache above is 4-way set associative.

### Valid Bit

Everything in hardware is "0101...". A single **valid bit*** is used in each entry to indicate whether the entry is holding a mapped memory location associated with its content or a meaningless random value . 

	[Bucket]|v| entry 1 |v| entry 2 |v| entry 3 |v| entry 4
	[0]|1|  (8, x) |0|    -    |0|    -    |0|   -
	[1]|1| (17, x) |1| (57, x) |0|    -    |0|   -
	[2]|1|  (2, x) |1| (10, x) |1| (34, x) |0|   -
	[3]|1| (19, x) |1| (11, x) |1| (59, x) |1| (3, x)
	[4]|1| (36, x) |1|  (4, x) |0|    -    |0|   -
	[5]|1|  (5, x) |0|    -    |0|    -    |0|   -  
	[6]|0|     -   |0|    -    |0|    -    |0|   -  
	[7]|0| (47, x) |0|    -    |0|    -    |0|   -

### Optimization 1: Associative Comparison 

It is possible to parallelize the process of entry searching by adding serval [comparators](http://en.wikipedia.org/wiki/Digital_comparator) at circuit level. Assume we have a 8-set 2-way cache, given a memory location `i`:

	def accessMemory(i):
	    # This part can be parallelized through parallel curcuits
	    # You will see the cuicuits later
	    cache_hit = (( i == key1) && v1) || (( i == key2) && v2)
        ...
        
By comparing simultaneously, CPU can judge whether cache hit or not very quickly.


### Replacement

Since the length of arrays in each bucket is limited(4 in this case), CPU can not insert as many as entries as it wants. Each time CPU tries to insert an entry into a full row, one existing entry in that row must be **victimized**, making room for the new entry. The process of choosing a entry to be knocked out is called **replacement**.

### Conflict Miss

Assume a cache is N-way set associative. If N is set too small, **conflict misses** will occur. Say N = 1, an application alternatively operates on memory location #5 and #13, both of which are hashed into the same cache set.  Hence, the reference to location #5 will lead to the eviction of the entry of #13 and vice versa.

Although increasing N will potentially reduce conflict misses, more ways also means more power, larger chip-area and longer searching time, so how to choose a best N is [some kind of art](https://www.google.com.hk/search?q=Six+Basic+Cache+Optimizations&oq=Six+Basic+Cache+Optimizations).
 

### LRU

One simple replacement policy is [LRU(Least-Recently Used)](http://en.wikipedia.org/wiki/LRU) which always elects the least-recently used entry to be replaced. This policy is intuitive because of the [temporal locality of data](http://en.wikipedia.org/wiki/Locality_of_reference).

LRU algorithm is equivalent to implementing a [priority queue](http://en.wikipedia.org/wiki/Priority_queue) for each bucket.


### Optimization 2: Substituting IDs with Tags

It is redundant to save the entire id in the entry, since all the entires in one slot share the same bucket id. Instead, we can store `id/k` only. So the hash table can be further compressed to:

	[Bucket]|v| entry 1 |v| entry 2 |v| entry 3 |v| entry 4
	[0]|1|  (1, x) |0|    -    |0|    -    |0|   -
	[1]|1|  (2, x) |1|  (7, x) |0|    -    |0|   -
	[2]|1|  (0, x) |1|  (1, x) |1|  (7, x) |0|   -
	[3]|1|  (2, x) |1|  (1, x) |1|  (7, x) |1| (0, x)
	[4]|1|  (4, x) |1|  (0, x) |0|    -    |0|   -
	[5]|1|  (0, x) |0|    -    |0|    -    |0|   -  
	[6]|0|     -   |0|    -    |0|    -    |0|   -  
	[7]|0|  (5, x) |0|    -    |0|    -    |0|   -

The hardware people often name **tag** this bucket-wise unique id. By comparing to the tags of all the entries within a bucket, CPU can figure out whether hit or not.


### Cache Block

In fact, each entry in the cache holds a **block** of data. So the memory location metioned above refers to the start of a block. 

	def accessMemory(i, offset, op):
	    ...
	    if cache_hit:
		  block = cache.get(i)
		  return block[offset].op()

Assume there are 16 bytes per block, the final picture of our cache looks like:
 
	[Bucket]|v| entry 1 |v| entry 2 |v| entry 3 |v| entry 4
	[0]|1|  (1, B[16]) |0|      -      |0|      -      |0|   -
	[1]|1|  (2, B[16]) |1|  (7, B[16]) |0|      -      |0|   -
	[2]|1|  (0, B[16]) |1|  (1, B[16]) |1|  (7, B[16]) |0|   -
	[3]|1|  (2, B[16]) |1|  (1, B[16]) |1|  (7, B[16]) |1| (0, B[16])
	[4]|1|  (4, B[16]) |1|  (0, B[16]) |0|      -      |0|   -
	[5]|1|  (0, B[16]) |0|      -      |0|      -      |0|   -  
	[6]|0|       -     |0|      -      |0|      -      |0|   -  
	[7]|0|  (5, B[16]) |0|      -      |0|      -      |0|   -


### The Real Picture

![](http://ww3.sinaimg.cn/mw690/534218ffjw1ebcgaxt5guj20li0i6wg7.jpg)
